﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace houseflow2.Models
{
    public class Users
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public bool IsAdmin { get; set; } = false;
    }
}
