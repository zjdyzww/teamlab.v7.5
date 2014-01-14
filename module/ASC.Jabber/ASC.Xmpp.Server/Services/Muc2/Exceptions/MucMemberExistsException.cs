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

namespace ASC.Xmpp.Server.Services.Muc2.Exceptions
{
    using System;

    public class MucMemberExistsException : Exception
    {
        public Error GetError()
        {
            return new Error(ErrorCondition.Conflict);
        }
    }


    public class MucMemberNotFoundException : Exception
    {
        public Error GetError()
        {
            return new Error(ErrorCondition.ItemNotFound);
        }
    }
}