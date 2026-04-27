@echo off
set SOURCE=C:\Users\Ramon DevTec\.gemini\antigravity\brain\3a6bed8b-a5c2-4d45-a33f-061945be4c0e
set DEST=public\badges

mkdir %DEST% 2>nul

copy "%SOURCE%\foco_de_aco_1777292543930.png" "%DEST%\foco_de_aco.png"
copy "%SOURCE%\madrugador_1777292556167.png" "%DEST%\madrugador.png"
copy "%SOURCE%\mestre_dos_livros_1777292572228.png" "%DEST%\mestre_dos_livros.png"
copy "%SOURCE%\grande_sabio_1777292594033.png" "%DEST%\grande_sabio.png"
copy "%SOURCE%\qi_de_320_1777292608086.png" "%DEST%\qi_de_320.png"
copy "%SOURCE%\devorador_de_variaveis_1777292620744.png" "%DEST%\devorador_de_variaveis.png"
copy "%SOURCE%\tal_pai_tal_filho_1777292641852.png" "%DEST%\tal_pai_tal_filho.png"
copy "%SOURCE%\hakuna_matata_1777292655163.png" "%DEST%\hakuna_matata.png"
copy "%SOURCE%\ao_infinito_e_alem_1777292668905.png" "%DEST%\ao_infinito_e_alem.png"
copy "%SOURCE%\pequeno_padawan_v3_1777292721321.png" "%DEST%\pequeno_padawan.png"

echo Concluído! As imagens foram movidas para public\badges.
pause
