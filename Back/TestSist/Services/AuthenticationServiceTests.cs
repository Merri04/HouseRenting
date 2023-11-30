using houseflow2;
using houseflow2.Interfaces;
using houseflow2.Models;
using houseflow2.Services;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestSist.Services
{
    public class AuthenticationServiceTests
    {
        [Fact]
        public async Task Register_NewUser_ReturnsTrue()
        {
            // Arrange
            var (mockDb, authService) = SetupMocks(MockEmptyCursor());

            // Act
            var result = await authService.Register("newuser@gmail.com", "password", "John", "Doe");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task Register_ExistingUser_ThrowsException()
        {
            // Arrange
            var (mockDb, authService) = SetupMocks(MockUsersCursor());

            // Act and Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => authService.Register("test@gmail.com", "password", "John", "Doe"));
            Assert.Equal("User with the same email already exists.", exception.Message);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsLoginResult()
        {
            // Arrange
            var (mockDb, authService) = SetupMocks(MockUsersCursor());
            var userCollection = new Mock<IMongoCollection<Users>>();
            // Act
            var result = await authService.Login("test@gmail.com", "123456");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@gmail.com", result.UserName);
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsNull()
        {
            // Arrange
            var (mockDb, authService) = SetupMocks(MockUsersCursor());

            // Act
            var result = await authService.Login("test@gmail.com", "wrongpassword");

            // Assert
            Assert.Null(result);
        }

        // Helper method to set up mocks
        private static (Mock<IMongoDBContext>, AuthenticationService) SetupMocks<TCursor>(Task<TCursor> cursorTask)
     where TCursor : IAsyncCursor<Users>
        {
            var mockDb = new Mock<IMongoDBContext>();
            var userCollection = new Mock<IMongoCollection<Users>>();

            // Mocking GetCollection method for "user" collection
            mockDb.Setup(x => x.GetCollection<Users>("user"))
                  .Returns(userCollection.Object);

            // Mocking FindAsync method
            userCollection
                .Setup(x => x.FindAsync(
                    It.IsAny<FilterDefinition<Users>>(),
                    It.IsAny<FindOptions<Users, Users>>(),
                    It.IsAny<CancellationToken>()
                ))
                .ReturnsAsync(cursorTask.Result);

            var mockOptions = new Mock<IOptions<JwtConfig>>();

            var authService = new AuthenticationService(mockDb.Object, mockOptions.Object);

            return (mockDb, authService);
        }




        private static Task<IAsyncCursor<Users>> MockUsersCursor()
        {
            var users = new List<Users>
            {
                new Users
                {
                    Id = ObjectId.Parse("651464f29e9afbfdf56a555d"),
                    Email = "test@gmail.com",
                    Password = "123456",
                    FirstName = "narges",
                    LastName = "rezaei"
                }
            };

            var mockCursor = Mock.Of<IAsyncCursor<Users>>(_ => _.Current == users);
            return Task.FromResult(mockCursor);
        }

        private static Task<IAsyncCursor<Users>> MockEmptyCursor()
        {
            var mockCursor = Mock.Of<IAsyncCursor<Users>>(_ => _.Current == new List<Users>());
            return Task.FromResult(mockCursor);
        }
    }
}
