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

namespace ASC.Mail.Net.ABNF
{
    #region usings

    using System;
    using System.Collections.Generic;

    #endregion

    /// <summary>
    /// This class implements ABNF parser. Defined in RFC 5234.
    /// </summary>
    public class ABFN
    {
        #region Members

        private readonly List<ABNF_Rule> m_pRules;

        #endregion

        #region Properties

        /// <summary>
        /// Gets ABNF rules collection.
        /// </summary>
        public List<ABNF_Rule> Rules
        {
            get { return m_pRules; }
        }

        #endregion

        #region Constructor

        /// <summary>
        /// Default constructor.
        /// </summary>
        public ABFN()
        {
            m_pRules = new List<ABNF_Rule>();

            Init();
        }

        #endregion

        #region Methods

        /// <summary>
        /// Parses and adds ABNF rules from the specified ABFN string.
        /// </summary>
        /// <param name="value">ABNF string.</param>
        /// <exception cref="ArgumentNullException">Is raised when <b>value</b> is null reference.</exception>
        public void AddRules(string value)
        {
            if (value == null)
            {
                throw new ArgumentNullException("value");
            }

            // TODO:
        }

        #endregion

        #region Utility methods

        private void Init()
        {
            #region Add basic rules

            /*
            ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z

            BIT            =  "0" / "1"

            CHAR           =  %x01-7F
                                ; any 7-bit US-ASCII character,
                                ;  excluding NUL


            CR             =  %x0D
                                ; carriage return

            CRLF           =  CR LF
                                ; Internet standard newline

            CTL            =  %x00-1F / %x7F
                                ; controls

            DIGIT          =  %x30-39
                                ; 0-9

            DQUOTE         =  %x22
                                ; " (Double Quote)

            HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"

            HTAB           =  %x09
                                ; horizontal tab

            LF             =  %x0A
                                ; linefeed

            LWSP           =  *(WSP / CRLF WSP)
                                ; Use of this linear-white-space rule
                                ;  permits lines containing only white
                                ;  space that are no longer legal in
                                ;  mail headers and have caused
                                ;  interoperability problems in other
                                ;  contexts.
                                ; Do not use when defining mail
                                ;  headers and use with caution in
                                ;  other contexts.

            OCTET          =  %x00-FF
                                ; 8 bits of data

            SP             =  %x20

            VCHAR          =  %x21-7E
                                ; visible (printing) characters

            WSP            =  SP / HTAB
                                ; white space
*/

            #endregion
        }

        #endregion
    }
}