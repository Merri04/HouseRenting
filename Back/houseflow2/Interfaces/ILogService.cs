namespace houseflow2.Interfaces
{
    public interface ILogService
    {
        void WriteExceptionAsync(string request, string requestCode);
        void WriteVisitAsync(string message);
    }
}
