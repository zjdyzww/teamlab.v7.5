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

using ASC.Xmpp.Core.utils.Xml.Dom;

namespace ASC.Xmpp.Core.protocol.extensions.bytestreams
{
    public class Activate : Element
    {
        public Activate()
        {
            TagName = "activate";
            Namespace = Uri.BYTESTREAMS;
        }

        public Activate(Jid jid) : this()
        {
            Jid = jid;
        }

        /// <summary>
        ///   the full JID of the Target to activate
        /// </summary>
        public Jid Jid
        {
            get
            {
                if (Value == null)
                    return null;
                else
                    return new Jid(Value);
            }
            set
            {
                if (value != null)
                    Value = value.ToString();
                else
                    Value = null;
            }
        }
    }
}