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

//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18052
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASC.Web.Community.Forum.Core.Module {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class ForumPatternResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal ForumPatternResource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("ASC.Web.Community.Forum.Core.Module.ForumPatternResource", typeof(ForumPatternResource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to h1.New Post in Forum Topic: &quot;$TopicTitle&quot;:&quot;$PostURL&quot;
        ///
        ///$Date &quot;$UserName&quot;:&quot;$UserURL&quot; has created a new post in topic:
        ///
        ///$PostText
        ///
        ///&quot;Read More&quot;:&quot;$PostURL&quot;
        ///
        ///Your portal address: &quot;$__VirtualRootPath&quot;:&quot;$__VirtualRootPath&quot;
        ///
        ///&quot;Edit subscription settings&quot;:&quot;$RecipientSubscriptionConfigURL&quot;.
        /// </summary>
        internal static string pattern_PostInTopicEmailPattern {
            get {
                return ResourceManager.GetString("pattern_PostInTopicEmailPattern", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to h1.New Topic in Forums: &quot;$TopicTitle&quot;:&quot;$TopicURL&quot;
        ///
        ///$Date &quot;$UserName&quot;:&quot;$UserURL&quot; has created a new topic:
        ///
        ///$PostText
        ///
        ///&quot;Read More&quot;:&quot;$PostURL&quot;
        ///
        ///Your portal address: &quot;$__VirtualRootPath&quot;:&quot;$__VirtualRootPath&quot;
        ///
        ///&quot;Edit subscription settings&quot;:&quot;$RecipientSubscriptionConfigURL&quot;.
        /// </summary>
        internal static string pattern_TopicInForumEmailPattern {
            get {
                return ResourceManager.GetString("pattern_TopicInForumEmailPattern", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Community. New Post in Forum Topic: $TopicTitle.
        /// </summary>
        internal static string subject_PostInTopicEmailPattern {
            get {
                return ResourceManager.GetString("subject_PostInTopicEmailPattern", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Community. New Topic in Forums: $TopicTitle.
        /// </summary>
        internal static string subject_TopicInForumEmailPattern {
            get {
                return ResourceManager.GetString("subject_TopicInForumEmailPattern", resourceCulture);
            }
        }
    }
}
