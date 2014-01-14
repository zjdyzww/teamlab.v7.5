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

namespace ASC.Feed
{
    public struct TimeInterval
    {
        private readonly DateTime fromTime;
        private readonly DateTime toTime;


        public DateTime From 
        {
            get { return fromTime; }
        }

        public DateTime To
        {
            get { return toTime != default(DateTime) ? toTime : DateTime.MaxValue; }
        }


        public TimeInterval(DateTime fromTime, DateTime toTime)
        {
            this.fromTime = fromTime;
            this.toTime = toTime;
        }
    }
}
