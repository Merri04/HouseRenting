using houseflow2.DAL;
using houseflow2.ErrorHandling;
using houseflow2.Helper;
using houseflow2.Interfaces;
using houseflow2.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace houseflow2
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(opts => opts.SuppressModelStateInvalidFilter = true);

            services.Configure<AuthenticationConfig>(Configuration.GetSection(AuthenticationConfig.SectionName));
            services.Configure<JwtConfig>(Configuration.GetSection(JwtConfig.SectionName));

            services.AddSingleton<MongoDBContext>();

            services.AddEndpointsApiExplorer();
            services.AddControllers();
            services.AddSwaggerGen();


            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IHouseTypesService, HouseTypesService>();
            services.AddScoped<IHouseService, HouseService>();
            services.AddScoped<ILogService, LogService>();
            services.AddScoped<IHouseImageService, HouseImageService>();
            services.AddScoped<IRentedHauseService, RentedHauseService>();
            services.AddScoped<IHttpContextService, HttpContextService>();
            services.AddScoped<IAccessService, AccessService>();

            services.AddCors(options =>
            {
                options.AddPolicy("HouseFlow", builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .AllowAnyHeader();
                });
            });

            // Add JWT authentication
            var jwtConfig = Configuration.GetSection("JwtConfig");
            services.Configure<JwtConfig>(jwtConfig);

            var secretKey = jwtConfig.GetValue<string>("SecretKey");
            var issuer = jwtConfig.GetValue<string>("Issuer");
            var audience = jwtConfig.GetValue<string>("Audience");
            var expireMinutes = jwtConfig.GetValue<int>("ExpireMinutes");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true, // This enables checking the expiration time
                    ClockSkew = TimeSpan.Zero // This makes sure the token is not considered valid after the expiration time
                };
            });
            services.AddHttpContextAccessor();


        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseAuthentication();
            app.UseRouting();
            app.UseCors(Keys.AppName);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                //app.UseExceptionHandler("error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            //middlewares
            app.UseMiddleware<ExceptionMiddleware>();

            // seed db ( define first static datas for data base ) 
            // seed db ( define first static datas for data base ) 
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;

                // Retrieve the HouseTypesService instance
                var houseTypesService = serviceProvider.GetRequiredService<IHouseTypesService>();
                var houseService = serviceProvider.GetRequiredService<IHouseService>();
                var houseImages = serviceProvider.GetRequiredService<IHouseImageService>();
                var users = serviceProvider.GetRequiredService<IAuthenticationService>();

                // Call the Seed HouseTypes Data method to seed the database
                houseTypesService.SeedHouseTypes();

                // Call the Seed Users Data method to seed the database
                users.SeedData();

                // Call the Seed House Data method to seed the database
                houseService.SeedData();

                // Call the Seed House Images Data method to seed the database
                houseImages.SeedData();
            }



            // status code errors
            app.UseStatusCodePages(async context => await HandleErrors.Exec(context.HttpContext));

            app.UseAuthorization();
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
