using houseflow2.Interfaces;
using houseflow2.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestSist.Services
{
    public class AccessServiceTests
    {
        [Fact]
        public async Task GetUserAsync_NullUserId_AllowNull_ReturnsNull()
        {
            // Arrange
            var mockHttpContextService = new Mock<IHttpContextService>();
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            var accessService = new AccessService(mockHttpContextService.Object, mockAuthenticationService.Object);

            // Mock HttpContextService to return null as UserName
            mockHttpContextService.Setup(x => x.UserName).Returns((string)null);

            // Act
            var result = await accessService.GetUserAsync(allowNull: true);

            // Assert
            Assert.Null(result);
        }
        [Fact]
        public async Task GetUserAsync_NullUserId_AllowNull_ThrowsException()
        {
            // Arrange
            var mockHttpContextService = new Mock<IHttpContextService>();
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            var accessService = new AccessService(mockHttpContextService.Object, mockAuthenticationService.Object);

            // Mock HttpContextService to return null as UserName
            mockHttpContextService.Setup(x => x.UserName).Returns((string)null);

            // Act and Assert
            await Assert.ThrowsAsync<Exception>(() => accessService.GetUserAsync(allowNull: false));
        }
    }
}
