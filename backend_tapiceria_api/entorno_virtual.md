# 1️⃣ Crear un entorno virtual

En tu carpeta del proyecto (backend_tapiceria_api):
```
python -m venv venv
```

- Esto creará una carpeta llamada venv con Python aislado.

# 2️⃣ Activar el entorno virtual
Windows (PowerShell)
```
.\venv\Scripts\Activate.ps1
```

Si te da un error de ejecución de scripts, ejecuta primero:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

y luego activa:
```
.\venv\Scripts\Activate.ps1
```

Windows (CMD)
```
venv\Scripts\activate.bat
```

Linux / macOS
```
source venv/bin/activate
```

# 3️⃣ Verificar que estás dentro del entorno
```
python --version
pip list
```

- Deberías ver que python apunta a tu carpeta venv.

- Cualquier paquete que instales con pip install solo afectará este entorno.
