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

#region Usings

using System.Collections.Generic;
using ASC.Projects.Core.Domain;

#endregion

namespace ASC.Projects.Core.DataInterfaces
{
    public interface ITemplateDao
    {
        List<Template> GetAll();

        Template GetByID(int id);

        Template Save(Template template);

        void Delete(int id);
	}
}
