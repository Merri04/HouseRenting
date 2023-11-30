namespace houseflow2
{
    public class AuthenticationConfig
    {
        public const string SectionName = "Authentication";

        public int MaxLoginFailCount { get; set; }
        public int LoginLockoutDuration { get; set; }
        public int SessionExpiry { get; set; }
        public int SmsExpiry { get; set; }
        public string RefTokenCookieName { get; set; } = string.Empty;
        public string SessionIdCookieName { get; set; } = string.Empty;
    }
}
