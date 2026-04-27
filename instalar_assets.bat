@echo off
set CURRENT_BRAIN=C:\Users\Ramon DevTec\Desktop\Projetos\Pedagogico\brain_assets
set OLD_BRAIN_1=C:\Users\Ramon DevTec\.gemini\antigravity\brain\f9ebee83-e0f7-433e-bf57-08a15e62f013
set OLD_BRAIN_2=C:\Users\Ramon DevTec\.gemini\antigravity\brain\b2d6fba2-0223-43c4-8ade-fecb3f122a20
set RECENT_BRAIN=C:\Users\Ramon DevTec\.gemini\antigravity\brain\3a6bed8b-a5c2-4d45-a33f-061945be4c0e

mkdir public\badges 2>nul
mkdir public\rewards 2>nul
mkdir public\icons 2>nul

echo Movendo Conquistas (3D Premium)...
copy "%RECENT_BRAIN%\foco_de_aco_1777292543930.png" "public\badges\foco_de_aco.png"
copy "%RECENT_BRAIN%\madrugador_1777292556167.png" "public\badges\madrugador.png"
copy "%RECENT_BRAIN%\mestre_dos_livros_1777292572228.png" "public\badges\mestre_dos_livros.png"
copy "%RECENT_BRAIN%\grande_sabio_1777292594033.png" "public\badges\grande_sabio.png"
copy "%RECENT_BRAIN%\qi_de_320_1777292608086.png" "public\badges\qi_de_320.png"
copy "%RECENT_BRAIN%\devorador_de_variaveis_1777292620744.png" "public\badges\devorador_de_variaveis.png"
copy "%RECENT_BRAIN%\tal_pai_tal_filho_1777292641852.png" "public\badges\tal_pai_tal_filho.png"
copy "%RECENT_BRAIN%\hakuna_matata_1777292655163.png" "public\badges\hakuna_matata.png"
copy "%RECENT_BRAIN%\ao_infinito_e_alem_1777292668905.png" "public\badges\ao_infinito_e_alem.png"
copy "%RECENT_BRAIN%\pequeno_padawan_v3_1777292721321.png" "public\badges\pequeno_padawan.png"

echo Movendo Recompensas (Versao Evoluída)...
copy "%RECENT_BRAIN%\reward_pizza_premium_1777293279593.png" "public\rewards\pizza.png"
copy "%RECENT_BRAIN%\reward_videogame_premium_1777293296836.png" "public\rewards\videogame.png"
copy "%RECENT_BRAIN%\reward_bau_premium_1777293314304.png" "public\rewards\bau.png"
copy "%RECENT_BRAIN%\reward_livros_premium_1777293339904.png" "public\rewards\livros.png"

echo Mantendo recompensas classicas...
copy "%OLD_BRAIN_1%\brinquedo_1776956612135.png" "public\rewards\brinquedo.png"
copy "%OLD_BRAIN_1%\caixa_presente_1776956639988.png" "public\rewards\presente.png"
copy "%OLD_BRAIN_1%\comida_sorvete_1776956626804.png" "public\rewards\sorvete.png"
copy "%OLD_BRAIN_1%\experiencia_1776956598321.png" "public\rewards\experiencia.png"

echo Movendo Icones...
copy "%OLD_BRAIN_2%\genioplay_pwa_icon_1777081914904.png" "public\icons\icon-512x512.png"

echo Concluído! Assets atualizados para a versão Premium.
pause
