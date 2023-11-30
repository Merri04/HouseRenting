using Helper;
using houseflow2.Attributes;
using houseflow2.Interfaces;
using houseflow2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Principal;

namespace houseflow2.Controllers
{
    [ApiController]
    [ValidateModel]
    public class HouseController
    {
        private readonly IHouseService _houseService;
        private readonly IHouseTypesService _houseTypesService;
        private readonly IRentedHauseService rentedHauseService;
        private readonly IAccessService accessService;

        public HouseController(IHouseService houseService, IHouseTypesService houseTypesService, IRentedHauseService rentedHauseService, IAccessService accessService)
        {
            _houseService = houseService;
            _houseTypesService = houseTypesService;
            this.rentedHauseService = rentedHauseService;
            this.accessService = accessService;
        }

        [Authorize]
        [HttpGet]
        [EnableCors("HouseFlow")]
        [Route("~/house/init-houses")]
        public async Task<Response> Index()
        {
            var user = await accessService.GetUserAsync();
            var houseTypes = _houseTypesService.GetAll();

            List<HouseTypesDTO> _houseTypes = new();

            houseTypes.ForEach(type =>
            {
                _houseTypes.Add(new HouseTypesDTO
                {
                    Id = type.Id.ToString(),
                    Title = type.Title,
                });

            });

            if (user is not null && !user.IsAdmin)
            {
                var tmp = await _houseService.GetUserHousesAsync(user.Id);

                List<HousesDTO> houses = new();

                tmp.ForEach(x =>
                {
                    houses.Add(new HousesDTO
                    {
                        Address = x.Address,
                        Description = x.Description,
                        FromDate = $"{x.FromDate:yyyy-MM-dd}",
                        ToDate = $"{x.ToDate:yyyy-MM-dd}",
                        Id = x.Id.ToString(),
                        Price = x.Price,
                        Title = x.Title,
                        TypeTitle = _houseTypesService.GetById(x.TypeId)?.Title,
                        TypeId = x.TypeId.ToString(),
                    });

                });

                var result = new { houseTypes = _houseTypes, houses };

                return new Response(result);
            }
            else
            {
                var houses = await _houseService.GetAllHousesAsync();

                var result = new { houses , houseTypes = _houseTypes };
                return new Response(result);
            }
        }

        //[Authorize]
        [Route("~/house/detail/{id}")]
        [EnableCors("HouseFlow")]
        [HttpGet]
        public async Task<Response> Details(string id)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return new Response("Invalid house ID format.");
            }
            var model = await _houseService.GetHouseByImagesAsync(objectId);

            if (model == null) return new Response("404");



            var user = await accessService.GetUserAsync(true);
            if (user is not null)
            {
                var rentedHauses = await rentedHauseService.GetRentedHauseByHauseIdAndUserId(ObjectId.Parse(model.House.Id), user.Id);
                if (rentedHauses is not null)
                {
                    model.RentedHauses = new RentedHausesDTO
                    {
                        FromDate = $"{rentedHauses.FromDate:yyyy-MM-dd}",
                        ToDate = $"{rentedHauses.ToDate:yyyy-MM-dd}",
                        HauseId = rentedHauses.HauseId.ToString(),
                        Numbers = rentedHauses.Numbers,
                        Id = rentedHauses.Id.ToString(),
                        UserId = rentedHauses.UserId.ToString(),
                    };
                }
            }


            return new Response(model);
        }


        [Authorize]
        [HttpPost]
        [EnableCors("HouseFlow")]
        [Route("~/house/save-changes")]
        public async Task<Response> SaveChanges( HousesDTO dto)
        {
            var user = await accessService.GetUserAsync();

            _ = ObjectId.TryParse(dto.Id, out ObjectId objectId);

            Houses house = new()
            {
                Id = objectId,
                Address = dto.Address,
                Description = dto.Description,
                FromDate = DateTime.Parse(dto.FromDate).Date,
                ToDate = DateTime.Parse(dto.ToDate).Date,
                OwnerId = user is not null? user.Id:ObjectId.GenerateNewId(),
                Price = dto.Price,
                Title = dto.Title,
                TypeId = ObjectId.Parse(dto.TypeId)
            };

            Houses? savedHouse = await _houseService.SaveChangesAsync(house);
            if (savedHouse is null) return new Response("server-error");

            HousesDTO resultHouse = new()
            { 
                Id = savedHouse.Id.ToString(),
                Address = savedHouse.Address,
                Description = savedHouse.Description,
                FromDate = $"{savedHouse.FromDate:yyyy-MM-dd}",
                ToDate = $"{savedHouse.ToDate:yyyy-MM-dd}",
                Price = savedHouse.Price,
                Title = savedHouse.Title,
                TypeTitle = _houseTypesService.GetById(savedHouse.TypeId)?.Title,
                TypeId = savedHouse.TypeId.ToString(),
                OwnerId = user != null ? user.Id.ToString():"",
            };
            return new Response(new { house = resultHouse });
        }

        

        [Authorize]
        [HttpDelete]
        [EnableCors("HouseFlow")]
        [Route("~/house/delete/{id}")]
        public async Task<Response> DeleteConfirmed(string id)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return new Response("Invalid house ID format.");

            var house = await _houseService.GetHouseAsync(objectId);

            if (house == null)
                return new Response("house-not-found");

            if (await _houseService.DeleteHouseAsync(house))
                return new Response(new { Deleted = true });
            else
                return new Response("Failed to delete the house.");
        }
    }
}
