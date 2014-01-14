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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ASC.Web.Studio.UserControls.Users.UserProfile
{
    public partial class LoadPhotoControl : UserControl
    {
        public static string Location
        {
            get { return "~/UserControls/Users/UserProfile/LoadPhotoControl.ascx"; }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            Page.RegisterStyleControl(VirtualPathUtility.ToAbsolute("~/usercontrols/users/userprofile/css/loadphoto_style.less"));
            Page.RegisterBodyScripts(ResolveUrl("~/usercontrols/users/userprofile/js/loadphoto.js"));
            _ctrlLoadPhotoContainer.Options.IsPopup = true;
        }
    }
}