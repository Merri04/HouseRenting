using houseflow2.DAL;
using houseflow2.Models;
using houseflow2.Services;
using houseflow2;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using houseflow2.Interfaces;

namespace TestSist.Services
{
    public class HouseImageServiceTests
    {
        [Fact]
        public async Task GetHouseImageAsync_ValidId_ReturnsHouseImage()
        {
            // Arrange
            var (_, _, imageService) = SetupMocks(MockHouseImagesCursor());

            var imageId = ObjectId.Parse("6517312bc03cd48949d4c5fb");

            // Act
            var result = await imageService.GetHouseImageAsync(imageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<HouseImages>(result);
        }
        [Fact]
        public async Task GetHouseImageAsync_InvalidId_ReturnsEmptyHouseImage()
        {
            // Arrange
            var (_, _, imageService) = SetupMocks(MockEmptyCursor());

            var invalidImageId = ObjectId.GenerateNewId();

            // Act
            var result = await imageService.GetHouseImageAsync(invalidImageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<HouseImages>(result);
            Assert.Equal(ObjectId.Empty, result.Id);
        }

        [Fact]
        public async Task GetImagesByHouseIdAsync_InvalidHouseId_ReturnsEmptyList()
        {
            // Arrange
            var (_, _, imageService) = SetupMocks(MockEmptyCursor());

            var invalidHouseId = ObjectId.GenerateNewId();

            // Act
            var result = await imageService.GetImagesByHouseIdAsync(invalidHouseId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<HouseImages>>(result);
            Assert.Empty(result);
        }

        private static (Mock<IMongoDBContext>, Mock<IMongoCollection<HouseImages>>, HouseImageService) SetupMocks(IFindFluent<HouseImages, HouseImages> cursor)
        {
            if (cursor is null)
            {
                throw new ArgumentNullException(nameof(cursor));
            }

            var mockDb = new Mock<IMongoDBContext>();
            var imageCollection = new Mock<IMongoCollection<HouseImages>>();
            var mockOptions = new Mock<IOptions<JwtConfig>>();

            mockDb.Setup(x => x.GetCollection<HouseImages>("houseImages")).Returns(imageCollection.Object);

            var imageService = new HouseImageService(mockDb.Object);

            return (mockDb, imageCollection, imageService);
        }

        private static IFindFluent<HouseImages, HouseImages> MockHouseImagesCursor()
        {
            var images = new List<HouseImages>
            {
                new HouseImages
                {
                    Id = ObjectId.Parse("6517312bc03cd48949d4c5fb"),
                    HouseId = ObjectId.Parse("6516f7d3686cf7e02ad554e9"),
                    ImageUrl = "test-image-url-1"
                },
                new HouseImages
                {
                    Id = ObjectId.Parse("65173132c03cd48949d4c5fc"),
                    HouseId = ObjectId.Parse("6516f7d3686cf7e02ad554e9"),
                    ImageUrl = "test-image-url-2"
                }
            };

            var mockCursor = Mock.Of<IAsyncCursor<HouseImages>>(_ => _.Current == images);
            return Mock.Of<IFindFluent<HouseImages, HouseImages>>(_ => _.ToCursor(It.IsAny<CancellationToken>()) == mockCursor);
        }

        private static IFindFluent<HouseImages, HouseImages> MockEmptyCursor()
        {
            var mockCursor = Mock.Of<IAsyncCursor<HouseImages>>(_ => _.Current == new List<HouseImages>());
            return Mock.Of<IFindFluent<HouseImages, HouseImages>>(_ => _.ToCursor(It.IsAny<CancellationToken>()) == mockCursor);
        }
    }
}
