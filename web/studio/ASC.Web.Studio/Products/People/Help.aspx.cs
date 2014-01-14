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
using ASC.Web.Studio;
using ASC.Web.Studio.UserControls.Common.HelpCenter;
using Resources;
using ASC.Web.Studio.Utility;

namespace ASC.Web.People
{
    public partial class Help : MainPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            HelpHolder.Controls.Add(LoadControl(HelpCenter.Location));
            Title = HeaderStringHelper.GetPageTitle(Resource.HelpCenter);
        }
    }
}