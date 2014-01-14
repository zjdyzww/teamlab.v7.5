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
using ASC.Xmpp.Core.utils;
using ASC.Xmpp.Core.utils.Xml.Dom;

namespace ASC.Xmpp.Core.protocol.extensions.filetransfer
{
    /// <summary>
    ///   Summary description for File.
    /// </summary>
    public class File : Element
    {
        /*
		Example 1:
		<file xmlns='http://jabber.org/protocol/si/profile/file-transfer'
			name='test.txt' 
			size='1022'/>
		
		Example 2:
		<file xmlns='http://jabber.org/protocol/si/profile/file-transfer'
			name='test.txt'
			size='1022'
			hash='552da749930852c69ae5d2141d3766b1'
			date='1969-07-21T02:56:15Z'>
			
			<desc>This is a test. If this were a real file...</desc>
		</file>
		
		Example 3:
		<file xmlns='http://jabber.org/protocol/si/profile/file-transfer'>
			<range offset='252' length='179'/>
		</file>
		  
		<xs:element name='file'>
			<xs:complexType>
			<xs:sequence minOccurs='0'>
				<xs:element name='desc' type='xs:string'/>
				<xs:element ref='range'/>
			</xs:sequence>
			<xs:attribute name='date' type='xs:dateTime' use='optional'/>
			<xs:attribute name='hash' type='xs:string' use='optional'/>
			<xs:attribute name='name' type='xs:string' use='required'/>
			<xs:attribute name='size' type='xs:integer' use='required'/>
			</xs:complexType>
		</xs:element>
		*/

        public File()
        {
            TagName = "file";
            Namespace = Uri.SI_FILE_TRANSFER;
        }

        public File(string name, long size) : this()
        {
            Name = name;
            Size = size;
        }

        /// <summary>
        ///   The file name. Its required
        /// </summary>
        public string Name
        {
            get { return GetAttribute("name"); }
            set { SetAttribute("name", value); }
        }

        /// <summary>
        ///   Size of the file. This is required
        /// </summary>
        public long Size
        {
            get { return GetAttributeLong("size"); }
            set { SetAttribute("size", value.ToString()); }
        }

        /// <summary>
        ///   a Hash checksum of the file
        /// </summary>
        public string Hash
        {
            get { return GetAttribute("hash"); }
            set { SetAttribute("hash", value); }
        }

        /// <summary>
        ///   file date
        /// </summary>
        public DateTime Date
        {
            get { return Time.ISO_8601Date(GetAttribute("date")); }
            set { SetAttribute("date", Time.ISO_8601Date(value)); }
        }

        /// <summary>
        ///   is used to provide a sender-generated description of the file so the receiver can better understand what is being sent. It MUST NOT be sent in the result.
        /// </summary>
        public string Description
        {
            get { return GetTag("desc"); }
            set { SetTag("desc", value); }
        }

        public Range Range
        {
            get
            {
                Element range = SelectSingleElement(typeof (Range));
                if (range != null)
                    return range as Range;
                else
                    return null;
            }
            set
            {
                RemoveTag(typeof (Range));
                AddChild(value);
            }
        }
    }
}