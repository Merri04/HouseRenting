namespace houseflow2.Interfaces
{
    public interface IAccessService
    {
        Task<Models.Users?> GetUserAsync(bool allowNull = false);
    }
}
