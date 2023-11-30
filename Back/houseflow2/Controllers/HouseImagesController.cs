using Helper;
using houseflow2.Attributes;
using houseflow2.Interfaces;
using houseflow2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace houseflow2.Controllers
{
    [Authorize]
    [ApiController]
    [ValidateModel]
    public class HouseImagesController
    {
        private readonly IHouseImageService _houseImageService;


        public HouseImagesController(IHouseImageService houseImageService)
        {
            _houseImageService = houseImageService;

        }

        [HttpGet]
        [EnableCors("HouseFlow")]
        [Route("~/house-images/init/{houseId}")]
        public async Task<Response> Index(string houseId)
        {
            if (!ObjectId.TryParse(houseId, out ObjectId objectId))
            {
                return new Response("Invalid house ID format.");
            }

            var images = await _houseImageService.GetImagesByHouseIdAsync(objectId);

            List<HouseImageDTO> imagesDTO = new List<HouseImageDTO>();

            images.ForEach(image => imagesDTO.Add(new HouseImageDTO
            {
                Id = image.Id.ToString(),
                ImageUrl = image.ImageUrl,
            }));

            var result = new { images = imagesDTO };

            return new Response(result);
        }

        [HttpPost]
        [EnableCors("HouseFlow")]
        [Route("~/house-images/upload/{houseId}")]
        public async Task<Response> Index(string houseId, IFormFile file)
        {
            if (!ObjectId.TryParse(houseId, out ObjectId objectId))
            {
                return new Response("Invalid house ID format.");
            }

            if (file != null && file.Length > 0)
            {
                try
                {
                    using var memoryStream = new MemoryStream();
                    await file.CopyToAsync(memoryStream);
                    var imageBytes = memoryStream.ToArray();

                    HouseImages newImage = new()
                    {
                        HouseId = objectId,
                        ImageUrl = Convert.ToBase64String(imageBytes) // Store image as base64 string or a URL as per your requirements
                    };

                    await _houseImageService.AddImageAsync(newImage);
                }
                catch
                {
                    return new Response(new { uploaded = false, message = "Error uploading image." });
                }
            }

            return new Response(new { uploaded = true });
        }

        [HttpDelete]
        [EnableCors("HouseFlow")]
        [Route("~/house-images/delete/{imageId}")]
        public async Task<Response> DeleteImage(string imageId)
        {
            if (!ObjectId.TryParse(imageId, out ObjectId objectId))
            {
                return new Response("Invalid house ID format.");
            }

            var image = await _houseImageService.GetHouseImageAsync(objectId);

            bool success = await _houseImageService.DeleteImageAsync(objectId);
            return new Response(new { deleted = success, message = !success ? "Error deleting image." : null });

        }
    }
}
