/* 
 * 
 * (c) Copyright Ascensio System Limited 2010-2014
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * http://www.gnu.org/licenses/agpl.html 
 * 
 */

window.master = {
    init: function () {
        if (window.addEventListener) {
            window.addEventListener('message', master.listener, false);
        } else {
            window.attachEvent('onmessage', master.listener);
        }
    },
    listener: function (evt) {
        var obj;
        if (typeof evt.data == "string") {
            try {
                obj = jQuery.parseJSON(evt.data);
            } catch (err) {
                return;
            }
        } else {
            obj = evt.data;
        }

        if (obj.Tpr == null) {
            return;
        }

        if (obj.Tpr == undefined || obj.Tpr != "Importer") {
            return;
        }

        if (obj.Data.length == 0) {
            ImportUsersManager.ShowImportErrorWindow(ImportUsersManager._emptySocImport);
            return;
        }

        jq("#importUsers .buttons .impBtn").removeClass("disable");
        jq("#importUsers .buttons .cncBtn").removeClass("disable");
		jq("#checkAll").removeAttr("disabled");

        jq('#userList').find("tr").not(".userItem").remove();
        var parent = jq('#userList');
        var items = parent.find(".userItem");
        for (var i = 0, n = obj.Data.length; i < n; i++) {
            if (!(ImportUsersManager.isExists(items, obj.Data[i].Email, false))) {
                ImportUsersManager.AppendUser(obj.Data[i]);
            }
        }
        ImportUsersManager.BindHints();

        jq('#checkAll').attr('checked', true);
    }
};
master.init();

var ImportUsersManager = new function() {
    this.FName = '';
    this.EmptyFName = '';
    this.LName = '';
    this.EmptyLName = '';
    this.Email = '';
    this._info = true;
    this._portalLicence = { name: '', cost: '', maxUsers: 0, currectUsers: 0 };
    this._errorImport = '';
    this._emptySocImport = '';
    this._flatUploader = null;
    this._msUploader = null;

    this.ShowImportControl = function(callback) {
        jq("#okwin").hide();
        jq('#checkAll').attr('checked', false);
        jq('#userList').find("tr").remove();
        jq('#fnError').css('visibility', 'hidden');
        jq('#lnError').css('visibility', 'hidden');
        jq('#eaError').css('visibility', 'hidden');
        jq('#donor tr').clone().appendTo('#userList');

        jq("#importUsers .buttons .impBtn").addClass("disable");
        jq("#importUsers .buttons .cncBtn").addClass("disable");
        jq("#checkAll").attr("disabled", "disabled");

        PopupKeyUpActionProvider.ClearActions();
        PopupKeyUpActionProvider.EnterActionCallback = callback;
        PopupKeyUpActionProvider.EnterAction = 'ImportUsersManager.CheckAndAdd();';
        PopupKeyUpActionProvider.CtrlEnterAction = "ImportUsersManager.ImportList();";

        StudioBlockUIManager.blockUI("#importAreaBlock", 810, 600, 0);

        if (jq("#inviteLinkCopy").length != 0) {
            var clip = new window.ZeroClipboard.Client();

            clip.addEventListener("mouseDown",
                function () {
                    var url = jq("#inviteUserLink").val();
                    clip.setText(url);
                });

            clip.addEventListener("onComplete",
                function () {
                    jq("#inviteUserLink, #inviteLinkCopy").yellowFade();
                });

            clip.glue("inviteLinkCopy", "inviteLinkPanel");
        }
    };

    this.ShowFinish = function() {
        StudioBlockUIManager.blockUI("#successImportedArea", 700, 130, 0);
    };

    this.ShowFinishWindow = function() {

        jq("#importAreaBlock").css('background-color', 'Transparent');
        jq("#importAreaBlock").css('background-color', '#aaaaaa');
        jq("#importAreaBlock").css('opacity', '0.3');
        jq("#okwin").show();
    };

    this.HideImportWindow = function() {
        ImportUsersManager.DefaultState();

        jq("#okwin").hide();
        jq('#userList').empty();
        jq.unblockUI();
    };
    this.ChangeVisionFileSelector = function() {
        if (jq('.importUsers div.file .fileSelector').css('display') == 'none') {
            jq('.importUsers div.file .fileSelector').show();
        } else {
            jq('.importUsers div.file .fileSelector').hide();
        }
    };
    this.DefaultState = function() {
        ImportUsersManager.HideImportUserLimitPanel();

        ImportUsersManager.AddHint('#firstName', ImportUsersManager.FName);
        ImportUsersManager.AddHint('#lastName', ImportUsersManager.LName);
        ImportUsersManager.AddHint('#email', ImportUsersManager.Email);

        jq('#email').removeClass('incorrectEmailBox');
        jq('#firstName').removeClass('incorrectEmailBox');
        jq('#lastName').removeClass('incorrectEmailBox');
    };

    this.AddUser = function() {
        var items = jq('#userList').find(".userItem");

        var firstName = jQuery.trim(jq('#firstName').val());
        var lastName = jQuery.trim(jq('#lastName').val());
        var address = jQuery.trim(jq('#email').val());

        if (!(ImportUsersManager.isExists(items, address, true) || address == '' || firstName == '' || firstName == this.FName || lastName == '' || lastName == this.LName || !jq.isValidEmail(address) || address == this.Email)) {
            jq('#userList').find("tr").not(".userItem").remove();
            jq('#email').removeClass('incorrectEmailBox');
            jq('#firstName').removeClass('incorrectEmailBox');
            jq('#lastName').removeClass('incorrectEmailBox');
            jq('#fnError').css('visibility', 'hidden');
            jq('#lnError').css('visibility', 'hidden');
            jq('#eaError').css('visibility', 'hidden');
            this.AppendUser({ FirstName: jq('#firstName').val(), LastName: jq('#lastName').val(), Email: jq('#email').val() });
            jq('#firstName').val('');
            jq('#firstName').blur();
            jq('#lastName').val('');
            jq('#lastName').blur();
            jq('#email').val('');
            jq('#email').blur();
            jq("#firstName").focus();

            if (jq('#userList').find('.userItem').length == jq('#userList').find('.userItem .check input:checked').length) {
                jq('#checkAll').attr('checked', true);

                jq("#importUsers .buttons .impBtn").removeClass("disable");
                jq("#importUsers .buttons .cncBtn").removeClass("disable");
                jq("#checkAll").removeAttr("disabled");
            }
        } else {
            if (firstName == '' || firstName == this.FName) {
                jq('#firstName').addClass('incorrectEmailBox');
                jq("#firstName").focus();
                jq('#fnError').css('visibility', 'visible');
            } else {
                jq('#firstName').removeClass('incorrectEmailBox');
                jq('#fnError').css('visibility', 'hidden');
            }

            if (lastName == '' || lastName == this.LName) {
                jq('#lastName').addClass('incorrectEmailBox');
                jq('#lnError').css('visibility', 'visible');

                if (!ImportUsersManager.WasFocused("firstName")) {
                    jq("#lastName").focus();
                }
            } else {
                jq('#lastName').removeClass('incorrectEmailBox');
                jq('#lnError').css('visibility', 'hidden');
            }

            if (address == '' || !jq.isValidEmail(address)) {
                jq('#email').addClass('incorrectEmailBox');
                jq('#eaError').css('visibility', 'visible');
                if (!(ImportUsersManager.WasFocused('firstName') || ImportUsersManager.WasFocused('lastName'))) {
                    jq("#email").focus();
                }
            } else {
                jq('#email').removeClass('incorrectEmailBox');
                jq('#eaError').css('visibility', 'hidden');
            }
        }
    };

    this.CheckAndAdd = function() {
        var firstName = jQuery.trim(jq('#firstName').val());
        var lastName = jQuery.trim(jq('#lastName').val());
        var address = jQuery.trim(jq('#email').val());

        if (firstName == '' || firstName == this.FName) {
            if (ImportUsersManager.WasFocused("firstName")) {
                jq('#firstName').addClass('incorrectEmailBox');
                jq('#fnError').css('visibility', 'visible');
            } else {
                jq("#firstName").focus();
            }
            return;
        } else {
            jq('#firstName').removeClass('incorrectEmailBox');
            jq('#fnError').css('visibility', 'hidden');
        }

        if (lastName == '' || lastName == this.LName) {

            if (ImportUsersManager.WasFocused("lastName")) {
                jq('#lastName').addClass('incorrectEmailBox');
                jq('#lnError').css('visibility', 'visible');
            } else {
                jq("#lastName").focus();
            }
            return;
        } else {
            jq('#lastName').removeClass('incorrectEmailBox');
            jq('#lnError').css('visibility', 'hidden');
        }

        if (address == '' || !jq.isValidEmail(address)) {
            if (ImportUsersManager.WasFocused("email")) {
                jq('#email').addClass('incorrectEmailBox');
                jq('#eaError').css('visibility', 'visible');
            } else {
                jq("#email").focus();
            }
            return;
        } else {
            jq('#email').removeClass('incorrectEmailBox');
            jq('#eaError').css('visibility', 'hidden');
        }

        ImportUsersManager.AddUser();
    };

    this.WasFocused = function(elementName) {
        return jQuery('#' + elementName).is(':focus');
    };

    this.isExists = function(items, email, select) {
        for (var index = 0, n = items.length; index < n; index++) {
            if (jQuery.trim(jq(items[index]).find('.email input').val()) == email) {
                if (select) {
                    jq(items[index]).find('.email').addClass('incorrectValue');
                }
                return true;
            }
            jq(items[index]).find('.email').removeClass('incorrectValue');
        }
        return false;
    };

    this.AppendUser = function(item) {
        jq('#userRecord').tmpl(item).appendTo('#userList');
        jq("#importUsers .buttons .impBtn").removeClass("disable");
        jq("#importUsers .buttons .cncBtn").removeClass("disable");
    };

    this.RemoveItem = function(item) {
        jq(item).parent().parent().addClass('remove');
        if (jq('#userList').find(".userItem").not('.remove').length == 0) {
            jq('#addUserBlock').removeClass('bordered');
        }
        jq(item).parent().parent().remove();

        if (jq('#userList').find('.userItem').length == 0) {
            jq('#donor tr').clone().appendTo('#userList');
            jq("#importUsers .buttons .impBtn").addClass("disable");
            jq("#importUsers .buttons .cncBtn").addClass("disable");
            jq("#checkAll").attr("disabled", "disabled");
        }
    };

    this.GetUsers = function() {
        var allItems = jq('#userList').find('.userItem');
        var items = [];
        jQuery.each(allItems, function() {
            if (jq(this).find('.check input').is(':checked')) {
                items.push(this);
            }
        });
        var arr = new Array();

        for (var i = 0, n = items.length; i < n; i++) {
            arr.push({
                "FirstName": this.CheckValue(jQuery.trim(jq(items[i]).find('.name .firstname .studioEditableInput').val()), this.EmptyFName),
                "LastName": this.CheckValue(jQuery.trim(jq(items[i]).find('.name .lastname .studioEditableInput').val()), this.EmptyLName),
                "Email": jQuery.trim(jq(items[i]).find('.email input').val())
            });
        }
        return arr;
    };

    this.CheckValue = function(value, hint) {
        return (value == hint) ? "" : value;
    };

    this.DeleteSelected = function() {
        var items = jq('#userList .userItem');
        jQuery.each(items, function() {
            if (jq(this).find('.check input').is(':checked')) {
                jq(this).remove();
            }
        });
        if (jq('#userList .userItem').length == 0) {
            jq('#checkAll').attr('checked', false);
            jq("#importUsers .buttons .impBtn").addClass("disable");
            jq("#importUsers .buttons .cncBtn").addClass("disable");
            jq("#checkAll").attr("disabled", "disabled");
        }
    };

    this.ChangeAll = function() {
        var state = jq('#checkAll').is(':checked');
        var items = jq('#userList .userItem');
        jQuery.each(items, function() {
            jq(this).find('.check input').attr('checked', state);
        });
        if (state) {
            jq("#importUsers .buttons .impBtn").removeClass("disable");
            jq("#importUsers .buttons .cncBtn").removeClass("disable");
        }
        else {
            jq("#importUsers .buttons .impBtn").addClass("disable");
            jq("#importUsers .buttons .cncBtn").addClass("disable");
        }
    };

    this.CheckState = function() {
        var checkedCount = jq('#userList .userItem .check input:checkbox:checked').length;
        var usersCount = jq('#userList').find('.userItem').length;
        var st = false;

        if (checkedCount == usersCount && usersCount > 0) {
            st = true;
        }

        jq('#checkAll').attr('checked', st);

        if (checkedCount == 0) {
            jq("#importUsers .buttons .impBtn").addClass("disable");
            jq("#importUsers .buttons .cncBtn").addClass("disable");
        }
        else {
            jq("#importUsers .buttons .impBtn").removeClass("disable");
            jq("#importUsers .buttons .cncBtn").removeClass("disable");
        }
    };

    this.EraseError = function(item) {
        jq(item).parents(".userItem").attr('class',
            jq(item).parents(".userItem").attr('class').replace(/saved\d/gi, '').replace(/error2/gi, ''));
    };

    this.ShowFinish = function() {
        StudioBlockUIManager.blockUI("#successImportedArea", 700, 130, 0);
    };

    this.ImportList = function() {
        if (jq('#userList').find('.userItem').not('fistable').length == 0) {
            return;
        }

        var users = ImportUsersManager.GetUsers();
        var importUsersAsCollaborators = jq("#importAsCollaborators").is(":checked");
        var inputUsers = jq('#userList').find('.userItem');
        var error = 0;

        if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
                var $inputUser = jq(inputUsers[i]);
                var isEmailValid = jq.isValidEmail(users[i].Email);
                if (users[i].Email == $inputUser.find(".email input").val()) {
                    if (users[i].Email == "" || users[i].FirstName == "" || users[i].LastName == "" || !isEmailValid) {
                        $inputUser.addClass((!isEmailValid) ? "error3" : "error1");
                        $inputUser.find(".errors").attr("title", ASC.Resources.Master.Resource.ImportContactsIncorrectFields);
                        $inputUser.find(".remove").addClass("removeError");
                        error++;
                        if (!isEmailValid) {
                            $inputUser.find(".email input").addClass("red-text");
                        }
                    }
                    else {
                        var attrs = $inputUser.attr("class");
                        $inputUser.attr("class", attrs.replace(/error\d/gi, ""));
                        $inputUser.find(".remove").removeClass("removeError");
                        $inputUser.find(".email input").removeClass("red-text");
                    }
                }
            }
            if (error > 0) {
                return;
            }
            if (!importUsersAsCollaborators) {
                if (parseInt(ImportUsersManager._portalLicence.maxUsers, 10) < (parseInt(ImportUsersManager._portalLicence.currectUsers, 10) + users.length)) {
                    ImportUsersManager.ShowImportUserLimitPanel();
                    return;
                }
            }
            ImportUsersManager.SaveUsers(users, importUsersAsCollaborators);
            return;
        }

        ImportUsersManager.HideImportUserLimitPanel();
        ImportUsersManager.CloseWindow(false);
    };

    this.SaveUsers = function (users, importUsersAsCollaborators) {

        ImportUsersManager.DisableImportDialog(true);

        AjaxPro.timeoutPeriod = 1800000;

        ImportUsersController.SaveUsers(JSON.stringify(users), importUsersAsCollaborators, function (result) {
            if (result.error && result.error.Message) {
                ImportUsersManager.DisableImportDialog(false);
                alert(result.error.Message);
                return;
            }
            var res = result.value;
            ImportUsersManager.SaveUsersCallback(res);
        });
    };

    this.CloseWindow = function(checkMistakes, mistakes) {

        var users = ImportUsersManager.GetUsers();
        ImportUsersManager.HideImportUserLimitPanel();
        if (!checkMistakes) {
            if (jq('#userList').find('.saved').length == users.length && users.length != 0) {
                ImportUsersManager.InformImportedWindow();
            }
        } else {
            if (mistakes == 0 && (jq('#userList').find('.saved').length == users.length && users.length != 0)) {
                ImportUsersManager.InformImportedWindow();
            } else {
                ImportUsersManager.BindHints();
            }
        }
    };

    this.InformImportedWindow = function() {
        ImportUsersManager.DefaultState();
        jq.unblockUI();
        ImportUsersManager.ShowFinish();
        setTimeout(function() {
            jq.unblockUI();
            window.location.href = "./#";
        }, 3000);
    };

    this.SaveUsersCallback = function(result) {
        var parent = jq('#userList .userItem');
        var mistakes = 0;
        if (result.Status == -1) {
            jq.unblockUI();
            TariffLimitExceed.showLimitExceedUsers();
            return;
        }

        if (result.Status == 0) {
            ImportUsersManager.ShowImportErrorWindow(result.Message);
            return;
        }


        jQuery.each(parent, function() {

            var attrs = jq(this).attr('class');
            jq(this).attr('class', attrs.replace(/error\d/gi, ''));
            jq(this).find('.remove').removeClass('removeError');

            var valueMail = jQuery.trim(jq(this).find('.email input').val());
            for (var i = 0, n = result.Data.length; i < n; i++) {
                if (result.Data[i].Email == valueMail) {
                    if (result.Data[i].Result != '') {
                        mistakes++;
                        jq(this).addClass(result.Data[i].Class);
                        jq(this).find('.errors').attr('title', result.Data[i].Result);
                        jq(this).find('.remove').addClass('removeError');
                    } else {
                        jq(this).addClass('saved');
                        var attrs = jq(this).attr('class');
                        jq(this).attr('class', attrs.replace(/error\d/gi, ''));
                        jq(this).find('.remove').removeClass('removeError');
                    }
                }
            }
        });
        ImportUsersManager.DisableImportDialog(false);
        if (mistakes == 0) {
            jq.unblockUI();
        } else {
            ImportUsersManager.BindHints();
        }
        ImportUsersManager.CloseWindow(true, mistakes);
    };

    this.BindHints = function() {
        var parent = jq('#userList .studioEditableInput');
        jQuery.each(parent, function() {
            if (jq(this).val() == '') {
                if (jq(this).is('[class*="firstName"]')) {
                    ImportUsersManager.AddHint(this, ImportUsersManager.EmptyFName);
                }
                if (jq(this).is('[class*="lastName"]')) {
                    ImportUsersManager.AddHint(this, ImportUsersManager.EmptyLName);
                }
            }
        });
    };

    this.HideInfoWindow = function(info) {
        jq('#blockProcess').hide();
        jq('.' + info).hide();
    };

    this.UploadResult = function(file, response) {
        jq('#upload').hide();

        var result = eval("(" + response + ")");
        if (result.Success) {
            var extractedUsers = JSON.parse(result.Message);
            jq('#userList').find("tr").not(".userItem").remove();

            var mistakes = 0;
            var copy = 0;
            var items = jq('#userList').find(".userItem");
            for (var i = 0, n = extractedUsers.length; i < n; i++) {
                if (jq.isValidEmail(extractedUsers[i].Email)) {

                    if (ImportUsersManager.isExists(items, extractedUsers[i].Email, false)) {
                        copy++;
                        continue;
                    }
                    ImportUsersManager.AppendUser(extractedUsers[i]);
                } else {
                    mistakes++;
                }
            }

            if (mistakes > 0 && copy != extractedUsers.length) {
                ImportUsersManager.ShowImportErrorWindow(ImportUsersManager._errorEmail);
            }

            ImportUsersManager.BindHints();

            if (jq('#userList').find(".userItem").length > 0) {
                jq("#importUsers .buttons .impBtn").removeClass("disable");
                jq("#importUsers .buttons .cncBtn").removeClass("disable");
                jq("#checkAll").removeAttr("disabled");
                if (jq('#userList').find('.userItem .check input:checked').length == jq('#userList').find('.userItem').length) {
                    jq('#checkAll').attr('checked', true);
                }
            }

        } else {
            jq('#blockProcess').show();
            jq('.okcss').show();
            ImportUsersManager.ShowImportErrorWindow(ImportUsersManager._errorImport);
        }
    };

    this.ShowImportErrorWindow = function(message) {
        jq('#blockProcess').show();
        jq('.okcss #infoMessage').html(message);
        jq('.okcss').show();
    };

    this.HideImportErrorWindow = function() {
        jq('#blockProcess').hide();
        jq('.okcss #infoMessage').html('');
        jq('.okcss').hide();

        ImportUsersManager.DefaultState();
    };

    this.SetControlHintSettings = function(controlName, defaultText) {
        jq(controlName).focus(function() {
            jq(controlName).removeClass('textEditDefault');
            jq(controlName).addClass('textEditMain');
            if (jq(controlName).val() == defaultText) {
                jq(controlName).val('');
            }
        });

        jq(controlName).blur(function() {
            if (jq(controlName).val() == '') {
                jq(controlName).removeClass('textEditMain');
                jq(controlName).addClass('textEditDefault');
                jq(controlName).val(defaultText);
            }
        });
    };

    this.AddHint = function(control, text) {
        jq(control).val(text);
        jq(control).addClass('textEditDefault');
        ImportUsersManager.SetControlHintSettings(control, text);
    };

    this.InitUploader = function(control, handler) {
        if (jq('#' + control).length > 0) {
            var cfg = {
                action: handler,
                onChange: function(file, ext) {
                    if (ext.length == 0 || ext[0].toLowerCase() != "csv") {
                        ImportUsersManager.ShowImportErrorWindow(ImportUsersManager._errorImport);
                        return false;
                    }
                    return true;
                },
                onSubmit: function(file, ext) {
                    jq('#upload').show();
                },
                onComplete: ImportUsersManager.UploadResult,
                parentDialog: (jq.browser.msie && jq.browser.version == 9) ? jq("#" + control).parent() : false,
                isInPopup: (jq.browser.msie && jq.browser.version == 9)
            };
            if (control == "import_flatUploader") {
                ImportUsersManager._flatUploader = new AjaxUpload(control, cfg);
            }
            if (control == "import_msUploader") {
                ImportUsersManager._msUploader = new AjaxUpload(control, cfg);
            }
        }
    };
    this.ChangeInviteLinkType = function() {
        var importTypeCheckbox = jq("#importAsCollaborators");
        var linkContainer = jq("#inviteUserLink");

        if (importTypeCheckbox.is(":disabled")) return;

        if (importTypeCheckbox.is(":checked")) {
            linkContainer.val(linkContainer.attr("data-invite-visitor-link"));
        } else {
            linkContainer.val(linkContainer.attr("data-invite-user-link"));
        }
    };
    this.ShowImportUserLimitPanel = function() {
        jq("#importUsers").block();
        jq("#importUserLimitPanel").show();
    };
    this.HideImportUserLimitPanel = function() {
        jq("#importUsers").unblock();
        jq("#importUserLimitPanel").hide();
    };
    this.ConfirmationLimit = function() {
        if (jq('#userList').find('.userItem').not('fistable').length == 0) {
            return;
        }

        var users = ImportUsersManager.GetUsers();
        var importUsersAsCollaborators = jq("#importAsCollaborators").is(":checked");

        if (users.length > 0) {
            ImportUsersManager.SaveUsers(users, importUsersAsCollaborators);
            return;
        }

        ImportUsersManager.HideImportUserLimitPanel();
        ImportUsersManager.CloseWindow(false);
    };
    this.DisableImportDialog = function(disable) {
        if (disable) {
            jq('#importAreaBlock').block();
            jq("#importUserLimitPanel #cnfrm_action_conainer").addClass("display-none");
            jq("#importUserLimitPanel #cnfrm_action_loader").removeClass("display-none");
        } else {
            jq('#importAreaBlock').unblock();
            jq("#importUserLimitPanel #cnfrm_action_conainer").removeClass("display-none");
            jq("#importUserLimitPanel #cnfrm_action_loader").addClass("display-none");
        }
    };
};

jq(document).ready(function () {

    ImportUsersManager.InitUploader('import_flatUploader', 'ajaxupload.ashx?type=ASC.Web.Studio.UserControls.Users.ContactsUploader,ASC.Web.Studio&obj=txt');
    ImportUsersManager.InitUploader('import_msUploader', 'ajaxupload.ashx?type=ASC.Web.Studio.UserControls.Users.ContactsUploader,ASC.Web.Studio&obj=ms');

    ImportUsersManager.AddHint('#firstName', ImportUsersManager.FName);
    ImportUsersManager.AddHint('#lastName', ImportUsersManager.LName);
    ImportUsersManager.AddHint('#email', ImportUsersManager.Email);
    
});