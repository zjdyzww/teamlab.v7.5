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

namespace ASC.Web.Studio.Utility
{
    public sealed class CustomResourceHelper
    {
        public static string GetResource(string name)
        {
            //Core.Users.CustomNamingPeople.Substitute<Resources.Resource>("Department");
            return Core.Users.CustomNamingPeople.Substitute<Resources.Resource>(name);
        }
    }
}
