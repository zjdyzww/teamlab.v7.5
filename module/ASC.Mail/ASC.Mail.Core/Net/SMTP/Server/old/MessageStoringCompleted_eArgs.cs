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
using System.IO;
using System.Collections.Generic;
using System.Text;

namespace LumiSoft.Net.SMTP.Server
{
    /// <summary>
    /// This class provides data for the MessageStoringCompleted event.
    /// </summary>
    public class MessageStoringCompleted_eArgs
    {
        private SMTP_Session    m_pSession       = null;
        private string          m_ErrorText      = null;
      //private long            m_StoredCount    = 0;
        private Stream          m_pMessageStream = null;
        private SmtpServerReply m_pCustomReply   = null;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="session">Reference to calling SMTP session.</param>
        /// <param name="errorText">Gets errors what happened on storing message or null if no errors.</param>
        /// <param name="messageStream">Gets message stream where messages was stored. Stream postions is End of Stream, where message storing ended.</param>
        public MessageStoringCompleted_eArgs(SMTP_Session session,string errorText,Stream messageStream)
        {
            m_pSession       = session;
            m_ErrorText      = errorText;
            m_pMessageStream = messageStream;
            m_pCustomReply   = new SmtpServerReply();
        }


        #region Properties Implementation

        /// <summary>
		/// Gets reference to smtp session.
		/// </summary>
		public SMTP_Session Session
		{
			get{ return m_pSession; }
		}

        /// <summary>
        /// Gets errors what happened on storing message or null if no errors.
        /// </summary>
        public string ErrorText
        {
            get{ return m_ErrorText; }
        }
        /*
        /// <summary>
        /// Gets count of bytes stored to MessageStream. This value as meaningfull value only if this.ErrorText == null (No errors).
        /// </summary>
        public long StoredCount
        {
            get{ return m_StoredCount; }
        }*/

        /// <summary>
        /// Gets message stream where messages was stored. Stream postions is End of Stream, where message storing ended.
        /// </summary>
        public Stream MessageStream
        {
            get{ return m_pMessageStream; }
        }

        /// <summary>
		/// Gets SMTP server reply info. You can use this property for specifying custom reply text and optionally SMTP reply code.
		/// </summary>
		public SmtpServerReply ServerReply
		{
			get{ return m_pCustomReply; }
		}

        #endregion

    }
}
