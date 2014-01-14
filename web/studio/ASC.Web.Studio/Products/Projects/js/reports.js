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

ASC.Projects.ReportView = (function() {
    var tmplId = null;
    var init = function() {

        var params = location.href.split("?")[1];
        var paramsCount = params.split("&").length;
        if (paramsCount > 1) {
            ASC.Projects.Reports.initComboboxes();
        } else {
            var reportType = jq.getURLParam("reportType");
            if (reportType == "5" || reportType == "8") {
                jq("#ddlUser" + Teamlab.profile.id).attr("selected", "selected");
            }
            ASC.Projects.Reports.initComboboxes();
        }

        tmplId = jq.getURLParam("tmplId");

        ASC.Projects.Reports.initFilterEvents();

        if (tmplId) initAutogeneratedPeriod();

        jq("#generateReport").click(function() {
            ASC.Projects.Reports.generateReportInNewWindow();
            return false;
        });

        jq("#removeReport").click(function() {
            Teamlab.deletePrjReportTemplate({}, tmplId, { success: function() {
                location.href = "reports.aspx?reportType=0";
            }
            });
            return false;
        });
        jq("#updateTemplate").click(function() {
            if (jq(this).hasClass("disable")) return false;
            updateReportTemplate();
            return false;
        });
        jq(".report-filter-container, .template-params").on("change", "input, select", function() {
            jq("#updateTemplate").removeClass("disable");
        });
        jq("#autoGeneration").change(function() {
            jq("#updateTemplate").removeClass("disable");
        });
        jq("#templateTitle").keydown(function() {
            jq("#updateTemplate").removeClass("disable");
        });
        //-----popup events----//
        jq("#createTemplate").click(function() {
            showTemplatePopup();
            return false;
        });
        jq("#autoGeneration").change(function() {
            if (jq(this).is(":checked")) {
                jq(".template-params .comboBox").removeAttr("disabled");
            } else {
                jq(".template-params .comboBox").attr("disabled", "disabled");
            }
        });
        jq("#generatedPeriods").change(function() {
            var val = jq(this).val();
            switch (val) {
                case "week":
                    {
                        jq("#month").hide();
                        jq("#week").show();
                        break;
                    }
                case "month":
                    {
                        jq("#week").hide();
                        jq("#month").show();
                        break;
                    }

                default:
                    {
                        jq("#week, #month").hide();
                    }
            }
        });
        jq("#reportTemplatePopup .button.gray").click(function() {
            jq.unblockUI();
            return false;
        });
        jq("#saveTemplate").click(function() {
            var name = jq.trim(jq("#templateTitle").val());
            if (!name.length) {
                jq("#reportTemplatePopup .requiredField").addClass("requiredFieldError");
                jq("#templateTitle").focus();
                return false;
            }
            jq("#reportTemplatePopup .requiredField").removeClass("requiredFieldError");

            var generateReportFilters = ASC.Projects.Reports.generateReportFilters();
            Teamlab.addPrjReportTemplate({}, generateReportFilters, { success: onSaveTemplate });
            jq.unblockUI();
            return false;
        });

        jq("#okWindow .button").click(function() {
            jq.unblockUI();
        });

        jq("#TimeIntervals").change(function () {
            if (jq('#TimeIntervals option:selected').val() == '0')
                jq('#otherInterval').show();
            else
                jq('#otherInterval').hide();
        });
    };

    var yellowFade = function(elem) {
        elem.css({ backgroundColor: '#F7F7F7' });
        elem.animate({ backgroundColor: '#F2F2F2' }, { queue: false, duration: 1000 });
        var resetStyle = function(self) { jq(self).removeAttr('style'); };
        setTimeout(resetStyle, 1100, this);
    };

    var onSaveTemplate = function(params, template) {
        var tmplContainer = jq("#reportsTemplates");
        var newTempl = "<li id='" + template.id + "'><a title='" + template.title + "' class='menu-report-name' href ='reports.aspx?tmplId="
                    + template.id + "&reportType=" + template.reportType + "'>" + template.title + "</a></li>";
        tmplContainer.prepend(newTempl);
        yellowFade(tmplContainer.find("li:first"));

        var tmplTitle = tmplContainer.siblings(".reports-category.templates");
        if (tmplTitle.hasClass("display-none")) {
            tmplTitle.removeClass("display-none");
        }
    };

    var onUpdateTemplate = function(params, tmpl) {
        showOkPopup();
        jq("#updateTemplate").addClass("disable");

        jq("#reportsTemplates .active").text(Encoder.htmlDecode(tmpl.title));
        jq("#reportsTemplates .active").attr("title", Encoder.htmlDecode(tmpl.title));
    };

    var initAutogeneratedPeriod = function() {
        if (jq("#autoGeneration").is(":checked")) {
            var select = jq("#generatedPeriods");
            var period = select.attr("data-period");
            select.find("option[value='" + period + "']").attr("selected", "selected");
            switch (period) {
                case "week":
                    jq("#week").val(jq("#week").attr("data-value")).show();
                    break;
                case "month":
                    jq("#month").val(jq("#month").attr("data-value")).show();
                    break;
            }
            jq("#hours").val(jq("#hours").attr("data-value")).show();
        }
    };

    var updateReportTemplate = function() {
        var id = jq.getURLParam("tmplId");
        var name = jq.trim(jq("#templateTitle").val());
        if (!name.length) {
            jq(".input-name-container").addClass("requiredFieldError");
            jq("#templateTitle").focus();
        } else {
            jq(".input-name-container").removeClass("requiredFieldError");
        }
        var generateReportFilters = ASC.Projects.Reports.generateReportFilters();
        Teamlab.updatePrjReportTemplate({}, id, generateReportFilters, { success: onUpdateTemplate });
    };

    var showTemplatePopup = function() {

        jq("#templateTitle").val(jq(".report-name").text());
        jq("#autoGeneration").removeAttr("checked");
        jq("#reportTemplatePopup .template-params .comboBox").attr("disabled", "disabled");

        var margintop = jq(window).scrollTop() - 135;
        margintop = margintop + 'px';
        jq.blockUI({
            message: jq("#reportTemplatePopup"),
            css: {
                left: '50%',
                top: '35%',
                opacity: '1',
                border: 'none',
                padding: '0px',
                width: '400px',

                cursor: 'default',
                textAlign: 'left',
                position: 'absolute',
                'margin-left': '-250px',
                'margin-top': margintop,
                'background-color': '#fff'
            },

            overlayCSS: {
                backgroundColor: '#AAA',
                cursor: 'default',
                opacity: '0.3'
            },
            focusInput: false,
            baseZ: 777,

            fadeIn: 0,
            fadeOut: 0
        });
    };

    var showOkPopup = function() {
        var margintop = jq(window).scrollTop() - 135;
        margintop = margintop + 'px';
        jq.blockUI({
            message: jq("#okWindow"),
            css: {
                left: '50%',
                top: '35%',
                opacity: '1',
                border: 'none',
                padding: '0px',
                width: '400px',

                cursor: 'default',
                textAlign: 'left',
                position: 'absolute',
                'margin-left': '-250px',
                'margin-top': margintop,
                'background-color': '#fff'
            },

            overlayCSS: {
                backgroundColor: '#AAA',
                cursor: 'default',
                opacity: '0.3'
            },
            focusInput: false,
            baseZ: 777,

            fadeIn: 0,
            fadeOut: 0
        });
    };

    return {
        init: init
    };
})(jQuery);

ASC.Projects.GeneratedReportView = (function() {
    var init = function() {

        jq("div.studioTopNavigationPanel").remove();
        jq("div.infoPanel").remove();
        jq("#studioPageContent").css("padding-bottom", "0");

        ASC.Projects.Reports.initFilterEvents();
        ASC.Projects.Reports.initComboboxes();

        jq("#printReportButton").click(function() {
            ASC.Projects.Reports.printReport();
            return false;
        });
        jq("#exportReportButton").click(function() {
            var showPopupFlag = localStorage.showExportReportPopupFlag;
            if (!showPopupFlag || showPopupFlag=="false") {
                showExportPopup();
            } else {
                ASC.Projects.Reports.exportToCsv();
            }
            return false;
        });

        jq("#okExportButton").click(function() {
            jq.unblockUI();
            var showPopupFlag = jq("#neverShowPopup").is(":checked");
            if (showPopupFlag) {
                localStorage.showExportReportPopupFlag = true;
            }
            ASC.Projects.Reports.exportToCsv();
        });

        jq("#generateNewReport").click(function() {
            var generateReportFilters = ASC.Projects.Reports.generateReportFilters();
            var reportUrl = ASC.Projects.Reports.generateReportUrl(generateReportFilters);
            location.href = reportUrl;
        });
        var showExportPopup = function() {
            var margintop = jq(window).scrollTop() - 135;
            margintop = margintop + 'px';
            jq.blockUI({
                message: jq("#exportPopup"),
                css: {
                    left: '50%',
                    top: '35%',
                    opacity: '1',
                    border: 'none',
                    padding: '0px',
                    width: '500px',

                    cursor: 'default',
                    textAlign: 'left',
                    position: 'absolute',
                    'margin-left': '-250px',
                    'margin-top': margintop,
                    'background-color': '#fff'
                },

                overlayCSS: {
                    backgroundColor: '#AAA',
                    cursor: 'default',
                    opacity: '0.3'
                },
                focusInput: false,
                baseZ: 777,

                fadeIn: 0,
                fadeOut: 0
            });
        };
    };
    return {
        init: init
    };
})(jQuery);

ASC.Projects.Reports = (function() {
    var createOptionElement = function(obj) {
        var option = document.createElement('option');
        option.setAttribute('id', obj.id);
        option.setAttribute('value', obj.value);
        option.appendChild(document.createTextNode(obj.title));
        return option;
    };

    var extendSelect = function(select, options) {
        for (var i = 0; i < options.length; i++) {
            select.append(createOptionElement(options[i]));
        }
        return select;
    };

    var onGetUsers = function(params, users) {
        var options = [];
        var userInd = users ? users.length : 0;
        while (userInd--) {
            options.unshift({ value: users[userInd].id, title: Encoder.htmlDecode(users[userInd].displayName), id: 'ddlUser' + users[userInd].id });
        }
        var usersSelect = jq("#Users");
        usersSelect.find('option[value!=0][value!=-1]').remove();
        extendSelect(usersSelect, options);
        jq("#ddlUser" + params.user).attr('selected', 'selected');
        usersSelect.tlcombobox();
        LoadingBanner.hideLoading();
    };

    var onGetProjects = function(params, projects) {
        var options = [];
        var projectsIds = [];
        var projectsInd = projects ? projects.length : 0;
        while (projectsInd--) {
            projectsIds.push(projects[projectsInd].id);
            options.unshift({ value: projects[projectsInd].id, title: projects[projectsInd].title, id: 'ddlProject' + projects[projectsInd].id });
        }
        var projectsddl = jq("#Projects");
        projectsddl.find('option[value!=0][value!=-1]').remove();
        extendSelect(projectsddl, options);
        jq("#ddlProject" + params.prj).attr('selected', 'selected');
        projectsddl.tlcombobox();


        if (jq('#Users').length) {
            if (params.tagID == -1) {
                Teamlab.getProfiles(params, { filter: { sortBy: "displayname" }, success: onGetUsers });
            }
            else {
                Teamlab.getPrjTeam(params, projectsIds, { success: onGetUsers });
            }
        }
        LoadingBanner.hideLoading();
    };

    return {
        initComboboxes: function() {
            jq("#Tags").tlcombobox();
            jq("#Projects").tlcombobox();
            jq("#Departments").tlcombobox();
            jq("#Users").tlcombobox();

            jq("#UpcomingIntervals").tlcombobox();
            jq("#TimeIntervals").tlcombobox();
            jq("#TaskStatuses").tlcombobox();
            jq("#PaymentsStatuses").tlcombobox();

            jq("[id$=fromDate]").mask(ASC.Resources.Master.DatePatternJQ);
            jq("[id$=toDate]").mask(ASC.Resources.Master.DatePatternJQ);

            jq("[id$=fromDate],[id$=toDate]").datepicker({ selectDefaultDate: true, showAnim: '' });
        },

        initFilterEvents: function() {
            jq("#Tags").change(function() {
                ASC.Projects.Reports.changeTag(jq('#Tags option:selected').val(), jq('#Projects option:selected').val(), jq('#Users option:selected').val());
            });
            jq("#Departments").change(function() {
                if (jq("#Users").length) {
                    ASC.Projects.Reports.changeDepartment();
                }
            });
            jq("#Projects").change(function() {
                if (jq("#Users").length) {
                    ASC.Projects.Reports.changeProject();
                }
            });
            jq("#Users").change(function() {
                ASC.Projects.Reports.changeResponsible();
            });
            jq("#departmentReport").change(function() {
                if (!jq("#departmentFilterContainer").is(":visible")) {
                    ASC.Projects.Reports.changeReportType(0);
                }
            });
            jq("#projectReport").change(function() {
                if (!jq("#projectFiltersContainer").is(":visible")) {
                    ASC.Projects.Reports.changeReportType(1);
                }
            });

            jq(".view-task-block input").change(function() {
                var id = jq(this).attr("id");
                if (id == "closedTasks") {
                    jq("#UpcomingIntervals").attr("disabled", "disabled");
                    jq('#UpcomingIntervals').tlcombobox(false);
                } else {
                    jq("#UpcomingIntervals").removeAttr("disabled");
                    jq('#UpcomingIntervals').tlcombobox();
                }
            });
        },

        changeProject: function(tag, prj, user) {
            LoadingBanner.displayLoading();
            tag = typeof (tag) == "undefined" ? jq('#Tags option:selected').val() : tag.toString();
            prj = typeof (prj) == "undefined" ? jq('#Projects option:selected').val() : prj.toString();
            user = typeof (user) == "undefined" ? jq('#Users option:selected').val() : user.toString();


            if (prj == "-1" && tag != "-1") {
                jq("#Projects").tlcombobox(false);
                Teamlab.getPrjProjects({ tagID: tag, prj: prj, user: user }, { filter: { tag: tag }, success: onGetProjects });
            }

            if (jq("#Users").length) {
                jq("#Users").tlcombobox(false);
                if (prj == "-1") {
                    if (tag == "-1") {
                        Teamlab.getProfiles({ user: user }, { filter: { sortBy: "displayname" }, success: onGetUsers });
                    }
                }
                else {
                    Teamlab.getPrjTeam({ user: user }, prj, { success: onGetUsers });
                }
            } else {
                LoadingBanner.hideLoading();
            }
            //disable combobox
        },

        changeDepartment: function(dep, user) {
            LoadingBanner.displayLoading();
            dep = typeof (dep) == "undefined" ? jq('#Departments option:selected').val() : dep.toString();
            user = typeof (user) == "undefined" ? "-1" : user.toString();

            if (jq("#Users").length) {
                jq("#Users").tlcombobox(false);
                if (dep != -1) {
                    Teamlab.getProfiles({ user: user }, { filter: { sortBy: "displayname", filterby: "group", filtervalue: dep }, success: onGetUsers });
                } else {
                    Teamlab.getProfiles({ user: user }, { filter: { sortBy: "displayname" }, success: onGetUsers });
                }

                if (user == "-1") {
                    jq('[id$=HiddenFieldForUser]').val('-1');
                }
            } else {
                LoadingBanner.hideLoading();
            }
        },

        changeResponsible: function() {
            var responsibleID = jq('#Users option:selected').val();

            if (responsibleID != '-1') {
                jq("#cbxShowTasksWithoutResponsible").attr("disabled", "disabled").removeAttr("checked");
            } else {
                jq("#cbxShowTasksWithoutResponsible").removeAttr("disabled");
            }
        },

        changeTag: function(tagID, prj, user) {
            LoadingBanner.displayLoading();
            tagID = typeof (tagID) == "undefined" ? -1 : tagID;
            prj = typeof (prj) == "undefined" ? "-1" : prj.toString();
            user = typeof (user) == "undefined" ? "-1" : user.toString();

            jq("#Projects").tlcombobox(false);
            if (tagID != -1) {
                Teamlab.getPrjProjects({ tagID: tagID, prj: prj, user: user }, { filter: { tag: tagID }, success: onGetProjects });
            }
            else {
                Teamlab.getPrjProjects({ tagID: tagID, prj: prj, user: user }, { success: onGetProjects });
            }
        },

        changeReportType: function(val) {
            if (val == 0) {
                jq("#departmentReport").attr("checked", "checked");
                jq("#projectFiltersContainer").hide();
                jq("#userFilterContainer").appendTo(jq("#departmentFilterContainer"));
                jq("#departmentFilterContainer").show();

                jq('#ddlUser-1').attr('selected', 'selected');
                jq('[id$=HiddenFieldForUser]').val('-1');

                ASC.Projects.Reports.changeDepartment();
            } else {
                jq("#projectReport").attr("checked", "checked");
                jq("#departmentFilterContainer").hide();
                jq("#userFilterContainer").appendTo(jq("#projectFiltersContainer"));
                jq("#projectFiltersContainer").show();

                jq('#ddlUser-1').attr('selected', 'selected');
                jq('[id$=HiddenFieldForUser]').val('-1');

                ASC.Projects.Reports.changeProject();
            }
        },

        printReport: function() {
            window.print();
        },

        generateReportFilters: function() {
            var filter = {};
            filter.reportType = jq.getURLParam("reportType") != null ? parseInt(jq.getURLParam("reportType")) : 0;

            if (jq("#cbxViewClosedProjects").length != 0) {
                filter.projectStatuses = jq("#cbxViewClosedProjects").is(':checked');
            }

            if (jq('#Projects option:selected[value!=-1]').length != 0) {
                filter.project = jq('#Projects option:selected[value!=-1]').val();
            }
            if (jq('#Departments option:selected[value!=-1]').length != 0) {
                filter.departament = jq('#Departments option:selected[value!=-1]').val();
            }
            if (jq('#Users option:selected[value!=-1]').length != 0) {
                filter.userId = jq('#Users option:selected[value!=-1]').val();
            }
            if (jq('#Tags option:selected[value!=-1]').length != 0) {
                filter.tag = jq('#Tags option:selected[value!=-1]').val();
            }
            if (jq('#TimeIntervals option:selected[value!=-1]').length != 0) {
                filter.reportTimeInterval = jq('#TimeIntervals option:selected[value!=-1]').val();
            }
            if (filter.reportType == 2 || filter.reportType == 6) {
                filter.viewType = jq("#departmentReport").is(':checked') ? 0 : 1;
                if (filter.viewType == 0) {
                    filter.project = undefined;
                } else {
                    filter.departament = undefined;
                }
            }
            if (filter.reportType == 8) {
                filter.viewType = jq("#byUsers").is(':checked') ? 0 : 1;
            }

            if (filter.reportType == 1) {
                filter.reportTimeInterval = 1;
                var fromDate = new Date();
                filter.fromDate = Teamlab.serializeTimestamp(fromDate);
                fromDate.setDate(fromDate.getDate() + parseInt(jq('#UpcomingIntervals option:selected').val()));
                filter.toDate = Teamlab.serializeTimestamp(fromDate);
            }

            if ((filter.reportType == 9 || filter.reportType == 10) && jq('#UpcomingIntervals option:selected').val() != "-1") {
                filter.reportTimeInterval = 1;
                var toDate = new Date();
                filter.toDate = Teamlab.serializeTimestamp(toDate);
                toDate.setDate(toDate.getDate() - parseInt(jq('#UpcomingIntervals option:selected').val()));
                filter.fromDate = Teamlab.serializeTimestamp(toDate);
            }

            if ((filter.reportType == 5 || filter.reportType == 8) && filter.reportTimeInterval == '0') {
                var fromDate1 = jq("[id$=fromDate]").datepicker('getDate');
                var toDate1 = jq("[id$=toDate]").datepicker('getDate');

                filter.fromDate = Teamlab.serializeTimestamp(fromDate1);
                filter.toDate = Teamlab.serializeTimestamp(toDate1);

                jq("#otherInterval .errorText").hide();
                if (jq("[id$=fromDate]").val() != "" && jq("[id$=toDate]").val() != "" && fromDate1.getTime() > toDate1.getTime()) {
                    jq("#otherInterval .errorText").show();
                }
            }


            if (jq("#TaskStatuses").length != 0) {
                if (jq("#TaskStatuses1").is(':selected')) {
                    filter.status = 1;
                } else if (jq("#TaskStatuses2").is(':selected')) {
                    filter.status = 2;
                }
            }

            if (jq("#PaymentsStatuses").length != 0) {
                if (jq("#NotChargeable").is(':selected')) {
                    filter.paymentStatus = 0;
                } else if (jq("#NotBilled").is(':selected')) {
                    filter.paymentStatus = 1;
                } else if (jq("#Billed").is(':selected')) {
                    filter.paymentStatus = 2;
                }
            }

            if (filter.reportType == 11) {
                filter.noResponsible = true;
            }
            if (filter.reportType == 9) {
                filter.noResponsible = jq("#cbxShowTasksWithoutResponsible").is(':checked');
            }

            filter.name = jq.trim(jq("#templateTitle").val());
            filter.autoGenerated = jq("#autoGeneration").is(":checked");

            if (filter.autoGenerated) {
                filter.period = jq("#generatedPeriods").val();
                filter.hour = jq("#hours").val();

                if (jq("#week").is(":visible")) filter.periodItem = jq("#week").val();
                if (jq("#month").is(":visible")) filter.periodItem = jq("#month").val();
            }

            return filter;
        },

        generateReportUrl: function(filter) {
            var reportUrl = "generatedreport.aspx?reportType=" + filter.reportType;

            if (filter.reportTimeInterval) {
                reportUrl += "&ftime=" + filter.reportTimeInterval;
            }

            if (!filter.projectStatuses && filter.reportType == 7) {
                reportUrl += "&fps=open";
            }

            if (filter.project) {
                reportUrl += "&fpid=" + filter.project;
            }

            if (filter.departament) {
                reportUrl += "&fd=" + filter.departament;
            }

            if (filter.userId) {
                reportUrl += "&fu=" + filter.userId;
            }

            if (filter.tag) {
                reportUrl += "&fpt=" + filter.tag;
            }

            if (filter.viewType) {
                reportUrl += "&fv=" + filter.viewType;
            }

            if (filter.status) {
                reportUrl += "&fts=" + filter.status;
            }

            if (filter.noResponsible) {
                reportUrl += "&nores=" + filter.noResponsible;
            }

            if (filter.fromDate) {
                reportUrl += "&ffrom=" + filter.fromDate.split('T')[0].split('-').join('');
            }

            if (filter.toDate) {
                reportUrl += "&fto=" + filter.toDate.split('T')[0].split('-').join('');
            }

            if (typeof (filter.paymentStatus) != "undefined") {
                reportUrl += "&fpays=" + filter.paymentStatus;
            }

            return reportUrl;
        },

        generateReportInNewWindow: function() {
            var generateReportFilters = ASC.Projects.Reports.generateReportFilters();
            var url = ASC.Projects.Reports.generateReportUrl(generateReportFilters);
            window.open(url);
        },

        exportToCsv: function() {

            window.location.href = window.location.href + "&format=csv";
        },

        exportToHTML: function() {

            window.location.href = window.location.href + "&format=html";
        },

        exportToXml: function() {

            window.location.href = window.location.href + "&format=xml";
        },

        generateReportByUrl: function(url) {
            open(url, "displayReportWindow", "status=yes,toolbar=yes,menubar=yes,scrollbars=yes");
        }
    };
})();

jq(document).ready(function() {
    if (location.href.indexOf("generatedreport") > 0) {
        ASC.Projects.GeneratedReportView.init();
        ASC.Projects.Reports.initComboboxes();
    } else {
        ASC.Projects.ReportView.init();
    }
});