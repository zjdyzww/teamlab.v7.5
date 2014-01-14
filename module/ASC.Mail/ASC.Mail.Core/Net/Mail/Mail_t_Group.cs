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

namespace ASC.Mail.Net.Mail
{
    #region usings

    using System.Collections.Generic;
    using System.Text;
    using MIME;

    #endregion

    /// <summary>
    /// Defined in RFC 2822 3.4.
    /// </summary>
    public class Mail_t_Group : Mail_t_Address
    {
        #region Members

        private readonly List<Mail_t_Mailbox> m_pList;
        private string m_DisplayName;

        #endregion

        #region Properties

        /// <summary>
        /// Gets or sets diplay name. Value null means not specified.
        /// </summary>
        public string DisplayName
        {
            get { return m_DisplayName; }

            set { m_DisplayName = value; }
        }

        /// <summary>
        /// Gets groiup address members collection.
        /// </summary>
        public List<Mail_t_Mailbox> Members
        {
            get { return m_pList; }
        }

        #endregion

        #region Constructor

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="displayName">Display name. Value null means not specified.</param>
        public Mail_t_Group(string displayName)
        {
            m_DisplayName = displayName;

            m_pList = new List<Mail_t_Mailbox>();
        }

        #endregion

        #region Methods

        /// <summary>
        /// Returns mailbox as string.
        /// </summary>
        /// <returns>Returns mailbox as string.</returns>
        public override string ToString()
        {
            return ToString(null);
        }

        /// <summary>
        /// Returns address as string value.
        /// </summary>
        /// <param name="wordEncoder">8-bit words ecnoder. Value null means that words are not encoded.</param>
        /// <returns>Returns address as string value.</returns>
        public override string ToString(MIME_Encoding_EncodedWord wordEncoder)
        {
            StringBuilder retVal = new StringBuilder();
            if (string.IsNullOrEmpty(m_DisplayName))
            {
                retVal.Append(":");
            }
            else
            {
                if (MIME_Encoding_EncodedWord.MustEncode(m_DisplayName))
                {
                    retVal.Append(wordEncoder.Encode(m_DisplayName) + ":");
                }
                else
                {
                    retVal.Append(TextUtils.QuoteString(m_DisplayName) + ":");
                }
            }
            for (int i = 0; i < m_pList.Count; i++)
            {
                retVal.Append(m_pList[i].ToString(wordEncoder));
                if (i < (m_pList.Count - 1))
                {
                    retVal.Append(",");
                }
            }
            retVal.Append(";");

            return retVal.ToString();
        }

        #endregion
    }
}