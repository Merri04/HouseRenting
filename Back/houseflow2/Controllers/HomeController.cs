using Helper;
using houseflow2.Attributes;
using houseflow2.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace houseflow2.Controllers;


[ApiController]
[ValidateModel]
public class HomeController 
{
    private readonly IHouseService houseService;
    private readonly IHouseTypesService _houseTypesService;

    public HomeController(IHouseService houseService, IHouseTypesService houseTypesService)
    {
        this.houseService = houseService;
        _houseTypesService = houseTypesService;
    }

    [HttpPost]
    [Route("~/home/init")]
    [EnableCors("HouseFlow")]
    public async Task<Response> Index(FilterDTO dto)
    {
        List<HouseImagesViewModel> homesWithImages = await houseService.GetAllHousesWithImages(dto.FromDate,dto.ToDate,dto.TypeId);

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

        var result = new { homesWithImages, houseTypes = _houseTypes };
        
        return new Response(result);
    }
}

