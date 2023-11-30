using houseflow2.DAL;
using houseflow2.Interfaces;
using houseflow2.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace houseflow2.Services
{
    public class HouseService : IHouseService
    {
        private readonly IMongoCollection<Houses> _houseCollection;
        private readonly IMongoCollection<HouseImages> _houseImagesCollection;
        private readonly IHouseTypesService _houseTypesService;

        private readonly MongoDBContext _db;

        public HouseService(MongoDBContext db, IHouseTypesService houseTypesService)
        {
            _db = db;
            _houseCollection = _db.GetCollection<Houses>("houses");
            _houseImagesCollection = _db.GetCollection<HouseImages>("houseImages");
            _houseTypesService = houseTypesService;
        }


        public void SeedData()
        {
            var houses = _houseCollection.Find(_ => true);
            if (houses.Any()) return;

            var house = new Houses
            {
                Id = ObjectId.Parse("6516f7d3686cf7e02ad554e9"),
                Title = "Beautiful Studio by the Amstel 2",
                Address = "Entire loft in Amsterdam, Netherlands",
                Price = 750,
                TypeId = ObjectId.Parse("6516a18447331b1448c897fa"),
                FromDate = DateTime.Parse("2023-09-10T20:30:00.000Z"),
                ToDate = DateTime.Parse("2023-09-22T20:30:00.000Z"),
                OwnerId = ObjectId.Parse("651464f29e9afbfdf56a555d"),
                Description = "The studio is very close to the Weesperzijde, the beautiful avenue along the river Amstel with many nice cafes and restaurants, a lot of houseboats and the best sunset view of the city"
            };

            _houseCollection.InsertOne(house);


            // to add new hause for seed 

            //house = new Houses
            //{
            //    Id = ObjectId.Parse("6516f7d3686cf7e02ad554e9"),
            //    Title = "House Title",
            //    Address = "House Address",
            //    Price = 2000,
            //    TypeId = ObjectId.Parse("6516a18447331b1448c897fa"),
            //    FromDate = DateTime.Parse("2023-09-10T20:30:00.000Z"),
            //    ToDate = DateTime.Parse("2023-09-22T20:30:00.000Z"),
            //    OwnerId = ObjectId.Parse("651464f29e9afbfdf56a555d"),
            //    Description = "House Description"
            //};

            //_houseCollection.InsertOne(house);
        }

        public async Task<bool> DeleteHouseAsync(Houses house)
        {
            try
            {
                var filter = Builders<Houses>.Filter.Eq("_id", house.Id);
                var result = await _houseCollection.DeleteOneAsync(filter);
                return result.DeletedCount > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<Houses>> GetAllHousesAsync()
        {
            try
            {
                var houses = await _houseCollection.Find(_ => true).ToListAsync();
                return houses;
            }
            catch
            {
                return new List<Houses>();
            }
        }

        public async Task<List<HouseImagesViewModel>> GetAllHousesWithImages()
        {
            try
            {
                List<HouseImagesViewModel> housesWithImages = new();

                var houses = await _houseCollection.Find(_ => true).ToListAsync();

                foreach (var house in houses)
                {
                    var images = await _houseImagesCollection.Find(i => i.HouseId == house.Id).ToListAsync();
                    if (images.Any())
                    {

                        var image = images.FirstOrDefault() ?? new HouseImages();

                        var houseWithImages = new HouseImagesViewModel
                        {
                            House = new HousesDTO
                            {
                                Id = house.Id.ToString(),
                                Title = house.Title,
                                Price = house.Price,
                                Address = house.Address,
                                TypeTitle = _houseTypesService.GetById(house.TypeId)?.Title,

                            },
                            Image = image,
                        };

                        housesWithImages.Add(houseWithImages);
                    }
                }

                return housesWithImages;
            }
            catch
            {
                return new List<HouseImagesViewModel>();
            }
        }
        
        public async Task<List<HouseImagesViewModel>> GetAllHousesWithImages(string fromDate, string toDate, string typeId)
        {
            try
            {
                List<HouseImagesViewModel> housesWithImages = new();

                var houses = await _houseCollection.Find(_ => true).ToListAsync();

                //filter by type id 
                if (!string.IsNullOrEmpty(typeId)) { 
                    houses = houses.Where(x=>x.TypeId == ObjectId.Parse(typeId)).ToList();
                }

                //filter by fromDate 
                if (!string.IsNullOrEmpty(fromDate))
                {
                    houses = houses.Where(x => x.ToDate > DateTime.Parse(fromDate)).ToList();
                }

                //filter by toDate 
                if (!string.IsNullOrEmpty(toDate))
                {
                    houses = houses.Where(x => x.FromDate < DateTime.Parse(toDate)).ToList();
                }

                foreach (var house in houses)
                {
                    var images = await _houseImagesCollection.Find(i => i.HouseId == house.Id).ToListAsync();
                    if (images.Any())
                    {

                        var image = images.FirstOrDefault() ?? new HouseImages();

                        var houseWithImages = new HouseImagesViewModel
                        {
                            House = new HousesDTO
                            {
                                Id = house.Id.ToString(),
                                Title = house.Title,
                                Price = house.Price,
                                Address = house.Address,
                                TypeTitle = _houseTypesService.GetById(house.TypeId)?.Title,

                            },
                            Image = image,
                        };

                        housesWithImages.Add(houseWithImages);
                    }
                }

                return housesWithImages;
            }
            catch
            {
                return new List<HouseImagesViewModel>();
            }
        }

        public async Task<Houses> GetHouseAsync(ObjectId id)
        {
            try
            {
                var filter = Builders<Houses>.Filter.Eq("_id", id);
                var house = await _houseCollection.Find(filter).FirstOrDefaultAsync();
                return house;
            }
            catch
            {
                throw new Exception("House Id not found");
            }
        }

        public async Task<HouseDetailViewModel> GetHouseByImagesAsync(ObjectId houseId)
        {
            try
            {
                var data = await _houseCollection.FindAsync(h => h.Id == houseId);

                var house = await data.FirstOrDefaultAsync();

                if (house == null)
                {
                    throw new Exception("House Id not found");
                }

                var _images = await _houseImagesCollection.FindAsync(i => i.HouseId == house.Id);

                var images = await _images.ToListAsync();

                var houseDetailViewModel = new HouseDetailViewModel
                {
                    House = new HousesDTO
                    {
                        Id = house.Id.ToString(),
                        Title = house.Title,
                        Price = house.Price,
                        Address = house.Address,
                        Description = house.Description,
                        ToDate = $"{house.ToDate:yyyy-MM-dd}",
                        FromDate = $"{house.FromDate:yyyy-MM-dd}",
                        TypeTitle = _houseTypesService.GetById(house.TypeId)?.Title,
                        // Add other properties as needed
                    },
                    Images = images
                };

                return houseDetailViewModel;
            }
            catch (Exception ex)
            {
                // Handle exception or log error
                throw new Exception("Error retrieving house details by images", ex);
            }
        }

        public async Task<List<Houses>> GetUserHousesAsync(ObjectId ownerId)
        {
            try
            {
                var filter = Builders<Houses>.Filter.Eq("OwnerId", ownerId);
                var houses = await _houseCollection.Find(filter).ToListAsync();
                return houses;
            }
            catch
            {
                return new List<Houses>();
            }
        }

        public async Task<Houses?> SaveChangesAsync(Houses house)
        {
            try
            {
                if (house.Id != ObjectId.Empty)
                {//update mode
                    var filter = Builders<Houses>.Filter.Eq("_id", house.Id);
                    var update = Builders<Houses>.Update
                        .Set("Title", house.Title)
                        .Set("Address", house.Address)
                        .Set("Description", house.Description)
                        .Set("FromDate", house.FromDate)
                        .Set("ToDate", house.ToDate)
                        .Set("TypeId", house.TypeId)
                        .Set("Price", house.Price);

                    var result = await _houseCollection.UpdateOneAsync(filter, update);
                }
                else
                {//insert mode 
                    await _houseCollection.InsertOneAsync(house);
                }
            }
            catch
            {
                return null;
            }
            return house;
        }

    }
}
