@echo off
echo ========================================
echo   HealthCheck Monitor - Lancement
echo ========================================
echo.

cd /d C:\Users\hp\PROJECTS\Java\Observateur-des-services\backend

REM Ajouter Maven au PATH - Chemin CORRECT
set MAVEN_HOME=C:\Program Files\apache\maven\apache-maven-3.9.16-bin\apache-maven-3.9.16
set PATH=%MAVEN_HOME%\bin;%PATH%

echo ✅ Maven configure: %MAVEN_HOME%
echo.

echo [1/3] Generation de la clé JWT...
for /f "delims=" %%a in ('powershell -Command "$bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [System.Convert]::ToBase64String($bytes)"') do set JWT_KEY=%%a
echo Clé JWT: %JWT_KEY%
echo.

echo [2/3] Creation du fichier application.properties...
if not exist src\main\resources mkdir src\main\resources

(
echo spring.application.name=healthcheck-monitor
echo server.port=8080
echo.
echo spring.datasource.url=jdbc:sqlite:healthcheck.db
echo spring.datasource.driver-class-name=org.sqlite.JDBC
echo spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
echo spring.jpa.hibernate.ddl-auto=update
echo spring.jpa.show-sql=false
echo.
echo jwt.secret=%JWT_KEY%
echo jwt.expiration=86400000
echo.
echo cors.allowed-origins=http://localhost:3000
echo.
echo logging.level.com.healthcheck=DEBUG
echo logging.file.name=logs/healthcheck.log
) > src\main\resources\application.properties

echo ✅ application.properties cree
echo.

echo [3/3] Compilation et lancement...

REM Tester si mvn est accessible
mvn -version
if errorlevel 1 (
    echo ❌ Maven n'est pas accessible !
    echo Veuillez verifier le chemin: %MAVEN_HOME%
    pause
    exit /b 1
)

mvn clean compile -DskipTests

if errorlevel 1 (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ Application demarree !
echo ========================================
echo.
echo 📊 Dashboard: http://localhost:8080
echo 📚 Swagger: http://localhost:8080/api-docs
echo 👤 Login: admin / admin123
echo.
echo Appuyez sur Ctrl+C pour arreter
echo ========================================

mvn spring-boot:run

pause