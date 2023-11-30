using MongoDB.Bson;

namespace houseflow2.Models
{
    public class HouseTypes
    {
        public ObjectId Id { get; set; }
        public string Title { get; set; } = "";
    }
}
