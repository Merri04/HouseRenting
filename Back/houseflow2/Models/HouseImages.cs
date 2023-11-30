using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace houseflow2.Models
{
    public class HouseImages
    {
        public ObjectId Id { get; set; }
        public ObjectId HouseId { get; set; }

        [Required]
        [NotNull]
        public string ImageUrl { get; set; } = "";
    }
}
