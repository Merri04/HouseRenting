using houseflow2.Services;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestSist.Services
{
    public class HttpContextServiceTests
    {
        [Fact]
        public void UserName_NotAuthenticated_ReturnsEmptyString()
        {
            // Arrange
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var httpContext = new Mock<HttpContext>();
            contextAccessor.Setup(x => x.HttpContext).Returns(httpContext.Object); // Return the mocked HttpContext

            var httpContextService = new HttpContextService(contextAccessor.Object);

            // Act
            var result = httpContextService.UserName;

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void GetHeader_HeaderExists_ReturnsHeaderValue()
        {
            // Arrange
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var headers = new HeaderDictionary { { "TestHeader", "TestValue" } };

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(x => x.Request.Headers).Returns(headers);

            contextAccessor.Setup(x => x.HttpContext).Returns(httpContext.Object);

            var httpContextService = new HttpContextService(contextAccessor.Object);

            // Act
            var result = httpContextService.GetHeader("TestHeader");

            // Assert
            Assert.Equal("TestValue", result);
        }

        [Fact]
        public void GetHeader_HeaderDoesNotExist_ReturnsEmptyString()
        {
            // Arrange
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(x => x.Request.Headers).Returns(new HeaderDictionary());

            contextAccessor.Setup(x => x.HttpContext).Returns(httpContext.Object);

            var httpContextService = new HttpContextService(contextAccessor.Object);

            // Act
            var result = httpContextService.GetHeader("NonExistentHeader");

            // Assert
            Assert.Equal(string.Empty, result);
        }


        [Fact]
        public void GetQuery_ReturnsQueryStringValue()
        {
            // Arrange
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var query = "?param1=value1&param2=value2";

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(x => x.Request.QueryString).Returns(new QueryString(query));

            contextAccessor.Setup(x => x.HttpContext).Returns(httpContext.Object);

            var httpContextService = new HttpContextService(contextAccessor.Object);

            // Act
            var result = httpContextService.GetQuery();

            // Assert
            Assert.Equal(query, result);
        }

        [Fact]
        public void GetCookieOption_ReturnsCookieOptions()
        {
            // Arrange & Act
            var result = HttpContextService.GetCookieOption();

            // Assert
            Assert.False(result.HttpOnly);
        }
    }
}
