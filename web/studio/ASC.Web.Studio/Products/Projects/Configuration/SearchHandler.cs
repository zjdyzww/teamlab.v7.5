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
using ASC.Projects.Core.Domain;
using ASC.Projects.Engine;
using ASC.Web.Core.ModuleManagement.Common;
using ASC.Web.Core.Utility;
using ASC.Web.Core.Utility.Skins;
using ASC.Web.Projects.Classes;
using ASC.Web.Projects.Resources;

namespace ASC.Web.Projects.Configuration
{
    public class SearchHandler : BaseSearchHandlerEx
    {
        public override Guid ProductID
        {
            get { return ProductEntryPoint.ID; }
        }

        public override ImageOptions Logo
        {
            get { return new ImageOptions { ImageFileName = "common_search_icon.png" }; }
        }

        public override Guid ModuleID
        {
            get { return ProductID; }
        }

        public override string SearchName
        {
            get { return ProjectsCommonResource.SearchText; }
        }

        public override IItemControl Control
        {
            get { return new ResultsView(); }
        }

        public override SearchResultItem[] Search(string text)
        {
            // make here
            var items = Global.EngineFactory.GetSearchEngine().Search(text, 0);

            var list = new List<SearchResultItem>();

            foreach (var searchGroup in items)
            {

                list.AddRange(searchGroup.Items.Select(searchResultItem => GetSearchResultItem(searchGroup, searchResultItem)));
            }

            return list.ToArray();
        }

        public SearchResultItem GetSearchResultItem(SearchGroup searchGroup, SearchItem searchResultItem)
        {
            var result = new SearchResultItem
                {
                    Name = searchResultItem.Title,
                    Additional = new Dictionary<string, object>
                        {
                            {
                                "Type",
                                searchResultItem.EntityType
                            },
                            {
                                "imageRef",
                                WebImageSupplier.GetAbsoluteWebPath(GetImage(searchResultItem.EntityType), ProductEntryPoint.ID)
                            },
                            {
                                "Hint",
                                GetHint(searchResultItem.EntityType)
                            }
                        },
                    URL = GetItemPath(searchResultItem.EntityType, searchResultItem.ID, searchGroup.ProjectID)
                };

            if (searchResultItem.EntityType != EntityType.Project)
            {
                result.Additional.Add("ProjectName", searchGroup.ProjectTitle);
                result.Date = searchResultItem.CreateOn;
                result.Description = searchResultItem.Description;
            }

            return result;
        }

        public string GetItemPath(EntityType type, string id, int projectId)
        {
            var virtPath = VirtualPathUtility.ToAbsolute(PathProvider.BaseVirtualPath);
            switch (type)
            {
                case EntityType.Message:
                    return string.Format("{2}messages.aspx?prjID={0}&ID={1}", projectId, id, virtPath);
                case EntityType.Milestone:
                    return string.Format("{2}milestones.aspx?prjID={0}&ID={1}", projectId, id, virtPath);
                case EntityType.Project:
                    return string.Format("{1}projects.aspx?prjID={0}", projectId, virtPath);
                case EntityType.Task:
                    return string.Format("{2}tasks.aspx?prjID={0}&ID={1}", projectId, id, virtPath);
                case EntityType.Team:
                    return string.Format("{1}projectteam.aspx?prjID={0}", projectId, virtPath);
                case EntityType.File:
                    return id;
                default:
                    return string.Empty;
            }
        }

        private static string GetImage(EntityType type)
        {
            switch (type)
            {
                case EntityType.Message:
                    return "filetype/discussion.png";
                case EntityType.Milestone:
                    return "filetype/milestone.png";
                case EntityType.Project:
                    return "filetype/project.png";
                case EntityType.Task:
                    return "filetype/task.png";
                case EntityType.Team:
                    return "filetype/employee.png";

                default:
                    return "filetype/projectfile.png";
            }
        }

        private static string GetHint(EntityType entityType)
        {
            switch (entityType)
            {
                case EntityType.Team:
                    return ProjectResource.Team;
                case EntityType.Comment:
                    return ProjectsCommonResource.Comment;
                case EntityType.Task:
                    return TaskResource.Task;
                case EntityType.Project:
                    return ProjectResource.Project;
                case EntityType.Milestone:
                    return MilestoneResource.Milestone;
                case EntityType.Message:
                    return MessageResource.Message;
                case EntityType.File:
                    return ProjectsFileResource.Documents;
                case EntityType.TimeSpend:
                    return ProjectsCommonResource.Time;
                case EntityType.SubTask:
                    return TaskResource.Subtask;
                default:
                    return String.Empty;
            }
        }
    }
}