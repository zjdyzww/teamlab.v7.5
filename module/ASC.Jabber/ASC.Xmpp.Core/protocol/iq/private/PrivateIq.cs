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

using ASC.Xmpp.Core.protocol.client;

namespace ASC.Xmpp.Core.protocol.iq.@private
{
    /// <summary>
    ///   Summary description for PrivateIq.
    /// </summary>
    public class PrivateIq : IQ
    {
        private readonly Private m_Private = new Private();

        public PrivateIq()
        {
            base.Query = m_Private;
            GenerateId();
        }

        public PrivateIq(IqType type) : this()
        {
            Type = type;
        }

        public PrivateIq(IqType type, Jid to) : this(type)
        {
            To = to;
        }

        public PrivateIq(IqType type, Jid to, Jid from) : this(type, to)
        {
            From = from;
        }

        public new Private Query
        {
            get { return m_Private; }
        }
    }
}