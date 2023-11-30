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
    public class RentedHauseController
    {
        private readonly IRentedHauseService _rentedHauseService;
        private readonly IHouseService houseService;
        private readonly IHouseImageService houseImageService;
        private readonly IHouseTypesService houseTypesService;
        private readonly IAccessService accessService;

        public RentedHauseController(IRentedHauseService rentedHauseService, IHouseService houseService, IHouseImageService houseImageService, IHouseTypesService houseTypesService, IAccessService accessService)
        {
            _rentedHauseService = rentedHauseService;
            this.houseService = houseService;
            this.houseImageService = houseImageService;
            this.houseTypesService = houseTypesService;
            this.accessService = accessService;
        }

        [HttpGet]
        [EnableCors("HouseFlow")]
        [Route("~/rented-house/init")]
        public async Task<Response> Index()
        {
            var user = await accessService.GetUserAsync();
            if (user is null) return new Response("bad-request");
            
            var rentedHauses = await _rentedHauseService.GetRentedHauses(user.Id);

            var model = new List<RentedHausesDTO>();

            foreach (var x in rentedHauses)
            {

                var hause = await houseService.GetHouseAsync(x.HauseId);

                var hauseImage = new HouseImages();

                var tmp = await houseImageService.GetImagesByHouseIdAsync(hause.Id);
                if (tmp is not null && tmp.Any())
                {
                    hauseImage = tmp.First();
                }

                model.Add(new RentedHausesDTO
                {
                    FromDate = $"{x.FromDate:yyyy-MM-dd}",
                    ToDate = $"{x.ToDate:yyyy-MM-dd}",
                    Numbers = x.Numbers,
                    Id = x.Id.ToString(),
                    RequestDate = x.RequestDate,
                    TotalPrice = (x.ToDate - x.FromDate).Days * hause.Price,
                    HouseImage = hauseImage,
                    House = new HousesDTO
                    {
                        Id = hause.Id.ToString(),
                        Title = hause.Title,
                        TypeTitle = houseTypesService.GetById(hause.TypeId).Title,
                    }
                });
            }

            var result = new { RentedHouses = model };
            return new Response(result);

        }

        [Authorize]
        [EnableCors("HouseFlow")]
        [HttpPost]
        [Route("~/rented-house/save-changes")]
        public async Task<Response> SaveChanges(RentedHausesDTO dto)
        {

            _ = ObjectId.TryParse(dto.Id, out ObjectId rentedHauseId);
            _ = ObjectId.TryParse(dto.HauseId, out ObjectId hauseId);

            if (hauseId == new ObjectId()) return new Response("house-not-found");

            var house = await houseService.GetHouseAsync(hauseId);
            if (house is null) return new Response("house-not-found");

            var user = await accessService.GetUserAsync();
            if (user is null) return new Response("bad-request");

            RentedHauses model = new()
            {
                FromDate = DateTime.Parse(dto.FromDate),
                ToDate = DateTime.Parse(dto.ToDate),
                Id = rentedHauseId,
                Numbers = dto.Numbers,
                UserId = user.Id,
                HauseId = hauseId,
                
            };


            // Add the rented house
            RentedHauses? rentedHauses = await _rentedHauseService.SaveChanges(model);
            if (rentedHauses is null) return new Response("server-error");
            return new Response(new
            {
                RentedHause = new RentedHausesDTO
                {
                    FromDate = $"{rentedHauses.FromDate:yyyy-MM-dd}",
                    ToDate = $"{rentedHauses.ToDate:yyyy-MM-dd}",
                    Id = rentedHauses.Id.ToString(),
                    Numbers = rentedHauses.Numbers,
                    UserId = rentedHauses.UserId.ToString(),
                    HauseId = rentedHauses.HauseId.ToString(),
                    TotalPrice = (rentedHauses.ToDate - rentedHauses.FromDate).Days * house.Price,
                }
            });
        }

        [HttpDelete]
        [EnableCors("HouseFlow")]
        [Route("~/rented-house/delete/{id}")]
        public async Task<Response> DeleteConfirmed(string id)
        {

            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return new Response("Invalid ID format.");

            // Delete the rented house by ID
            bool deleted = await _rentedHauseService.DeleteRentedHause(objectId);
            var result = new { deleted, message = deleted ? null : "delete-failed" };
            return new Response(result);
        }
    }
}
