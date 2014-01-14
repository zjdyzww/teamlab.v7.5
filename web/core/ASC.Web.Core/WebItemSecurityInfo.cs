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
using ASC.Core.Users;

namespace ASC.Web.Core
{
    [Serializable]
    public class WebItemSecurityInfo
    {
        public string WebItemId { get; set; }

        public IEnumerable<UserInfo> Users { get; set; }

        public IEnumerable<GroupInfo> Groups { get; set; }

        public bool Enabled { get; set; }
    }
}
