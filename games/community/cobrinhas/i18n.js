/* Local translations. No network requests and no changes to saved game identifiers. */
(function (root) {
  "use strict";
  const languages = ["pt-PT", "pt-BR", "en", "es", "fr", "de", "pl"];
  // Portuguese | English | Spanish | French | German | Polish
  const rows = `
Presente|Gift|Regalo|Cadeau|Geschenk|Prezent
Moedas grátis|Free coins|Monedas gratis|Pièces gratuites|Kostenlose Münzen|Darmowe monety
Completa aventuras|Complete adventures|Completa aventuras|Termine des aventures|Schließe Abenteuer ab|Ukończ przygody
EDITAR COBRINHA|EDIT SNAKE|EDITAR SERPIENTE|MODIFIER LE SERPENT|SCHLANGE BEARBEITEN|EDYTUJ WĘŻA
Moedas — abrir loja|Coins — open shop|Monedas — abrir tienda|Pièces — ouvrir la boutique|Münzen — Laden öffnen|Monety — otwórz sklep
Receber recompensa de uma aventura concluída|Collect a completed adventure reward|Recibir recompensa de una aventura completada|Récupérer la récompense d’une aventure terminée|Belohnung für ein abgeschlossenes Abenteuer abholen|Odbierz nagrodę za ukończoną przygodę
Clique esquerdo / Shift / Espaço para acelerar|Left click / Shift / Space to boost|Clic izquierdo / Mayús / Espacio para acelerar|Clic gauche / Maj / Espace pour accélérer|Linksklick / Umschalt / Leertaste für Tempo|Lewy przycisk / Shift / Spacja: przyspieszenie
Rato / WASD / setas para virar|Mouse / WASD / arrows to steer|Ratón / WASD / flechas para girar|Souris / WASD / flèches pour tourner|Maus / WASD / Pfeiltasten zum Steuern|Mysz / WASD / strzałki: sterowanie
Jogar!|Play!|¡Jugar!|Jouer !|Spielen!|Graj!
Continuar a brincar|Keep playing|Seguir jugando|Continuer à jouer|Weiterspielen|Graj dalej
Voltar a jogar!|Play again!|¡Jugar otra vez!|Rejouer !|Noch mal spielen!|Zagraj ponownie!
Uma pausinha|A little break|Una pausa|Une petite pause|Eine kleine Pause|Mała przerwa
Cobrinhas|Little Snakes|Serpientitas|Petits serpents|Kleine Schlangen|Małe węże
do|of the|del|du|im|w
Jardim|Garden|Jardín|Jardin|Garten|ogrodzie
Cobrinhas do Jardim|Garden Snakes|Serpientitas del Jardín|Petits serpents du jardin|Gartenschlangen|Węże w ogrodzie
UM MUNDO DE DESCOBERTAS|A WORLD OF DISCOVERIES|UN MUNDO DE DESCUBRIMIENTOS|UN MONDE DE DÉCOUVERTES|EINE WELT VOLLER ENTDECKUNGEN|ŚWIAT ODKRYĆ
Um bocadinho de fruta,|A little fruit,|Un poquito de fruta,|Un peu de fruits,|Ein bisschen Obst,|Trochę owoców,
um montão de aventura!|a whole lot of adventure!|¡un montón de aventuras!|plein d’aventures !|ganz viel Abenteuer!|mnóstwo przygód!
AS TUAS FRUTINHAS|YOUR FRUIT|TUS FRUTAS|TES FRUITS|DEINE FRÜCHTE|TWOJE OWOCE
O TEU RECORDE|YOUR BEST|TU RÉCORD|TON RECORD|DEIN REKORD|TWÓJ REKORD
Amigos do jardim|Garden friends|Amigos del jardín|Amis du jardin|Gartenfreunde|Przyjaciele ogrodu
Amigos|Friends|Amigos|Amis|Freunde|Przyjaciele
Uma aventura com o computador|An adventure with computer snakes|Una aventura con serpientes del ordenador|Une aventure avec des serpents de l’ordinateur|Ein Abenteuer mit Computerschlangen|Przygoda z wężami komputera
cobrinhas a explorar|snakes exploring|serpientes explorando|serpents en exploration|Schlangen unterwegs|węży odkrywających ogród
Vamos por aqui!|This way!|¡Por aquí!|Par ici !|Hier entlang!|Tędy!
Acelerar|Speed up|Acelerar|Accélérer|Beschleunigen|Przyspiesz
Qual é a tua cobrinha?|Which snake is yours?|¿Cuál es tu serpiente?|Quel est ton serpent ?|Welche Schlange gehört dir?|Który wąż jest twój?
A tua criação|Your creation|Tu creación|Ta création|Deine Kreation|Twoje dzieło
Verdinha|Leafy|Verdecita|Feuillette|Blättchen|Listek
Lilás|Lilac|Lila|Lilas|Flieder|Bez
Tangerina|Tangerine|Mandarina|Mandarine|Mandarine|Mandarynka
Gotinha|Droplet|Gotita|Gouttelette|Tröpfchen|Kropelka
Rosinha|Rosy|Rosita|Rosette|Röschen|Różyczka
Editar cobrinha|Edit snake|Editar serpiente|Modifier le serpent|Schlange gestalten|Zmień węża
Aventuras|Adventures|Aventuras|Aventures|Abenteuer|Przygody
O meu álbum|My album|Mi álbum|Mon album|Mein Album|Mój album
Roda da Sorte|Lucky Wheel|Rueda de la Suerte|Roue de la chance|Glücksrad|Koło szczęścia
Loja|Shop|Tienda|Boutique|Laden|Sklep
Troca as tuas moedas|Spend your coins|Canjea tus monedas|Échange tes pièces|Tausche deine Münzen|Wymień monety
4 skins de oferta|4 free outfits|4 aspectos de regalo|4 tenues offertes|4 kostenlose Outfits|4 darmowe stroje
Pequenas descobertas|Little discoveries|Pequeños descubrimientos|Petites découvertes|Kleine Entdeckungen|Małe odkrycia
autocolantes|stickers|pegatinas|autocollants|Sticker|naklejki
Sem pressa. Tenta outra vez sempre!|Take your time. You can always try again!|Sin prisa. ¡Siempre puedes intentarlo otra vez!|Prends ton temps. Tu peux toujours réessayer !|Lass dir Zeit. Versuch es jederzeit wieder!|Bez pośpiechu. Zawsze możesz spróbować ponownie!
Sem Internet · Sem anúncios · Adversárias do computador|Offline · No ads · Computer opponents|Sin Internet · Sin anuncios · Rivales del ordenador|Hors ligne · Sans publicité · Adversaires de l’ordinateur|Offline · Ohne Werbung · Computergegner|Offline · Bez reklam · Przeciwnicy komputerowi
A borda elimina a cobra|The border ends your round|El borde termina la partida|La bordure termine la partie|Der Rand beendet die Runde|Brzeg kończy rundę
Arrasta para virar|Drag to turn|Arrastra para girar|Glisse pour tourner|Zum Lenken ziehen|Przeciągnij, aby skręcić
Setas ou WASD|Arrows or WASD|Flechas o WASD|Flèches ou WASD|Pfeiltasten oder WASD|Strzałki lub WASD
Espaço para acelerar|Space to speed up|Espacio para acelerar|Espace pour accélérer|Leertaste zum Beschleunigen|Spacja przyspiesza
O TEU ATELIÊ DE CORES|YOUR COLOUR STUDIO|TU TALLER DE COLORES|TON ATELIER DE COULEURS|DEIN FARBATELIER|TWOJA PRACOWNIA KOLORÓW
Uma cobrinha só tua!|Your very own snake!|¡Una serpiente solo tuya!|Un serpent rien qu’à toi !|Deine eigene Schlange!|Twój własny wąż!
Feita à tua maneira|Made your way|Hecha a tu manera|À ta façon|Ganz nach deinem Geschmack|Po twojemu
As cores e os acessórios não alteram as regras.|Colours and accessories do not change the rules.|Los colores y accesorios no cambian las reglas.|Les couleurs et accessoires ne changent pas les règles.|Farben und Zubehör ändern die Regeln nicht.|Kolory i dodatki nie zmieniają zasad.
Corpo|Body|Cuerpo|Corps|Körper|Ciało
Cara|Face|Cara|Visage|Gesicht|Twarz
Magia|Magic|Magia|Magie|Magie|Magia
Bandeira|Flag|Bandera|Drapeau|Flagge|Flaga
Corpo da tua cobrinha|Your snake’s body|Cuerpo de tu serpiente|Le corps de ton serpent|Der Körper deiner Schlange|Ciało twojego węża
Cara da tua cobrinha|Your snake’s face|Cara de tu serpiente|Le visage de ton serpent|Das Gesicht deiner Schlange|Twarz twojego węża
Magia da tua cobrinha|Your snake’s magic|Magia de tu serpiente|La magie de ton serpent|Die Magie deiner Schlange|Magia twojego węża
Bandeira da tua cobrinha|Your snake’s flag|Bandera de tu serpiente|Le drapeau de ton serpent|Die Flagge deiner Schlange|Flaga twojego węża
Cor do corpo|Body colour|Color del cuerpo|Couleur du corps|Körperfarbe|Kolor ciała
Cor do padrão|Pattern colour|Color del dibujo|Couleur du motif|Musterfarbe|Kolor wzoru
Padrão do corpo|Body pattern|Dibujo del cuerpo|Motif du corps|Körpermuster|Wzór ciała
Padrão|Pattern|Dibujo|Motif|Muster|Wzór
Uma só cor|Solid colour|Un solo color|Couleur unie|Einfarbig|Jeden kolor
Riscas coloridas|Colourful stripes|Rayas de colores|Rayures colorées|Bunte Streifen|Kolorowe paski
Pintinhas|Spots|Lunares|Petits pois|Pünktchen|Kropki
Arco-íris|Rainbow|Arcoíris|Arc-en-ciel|Regenbogen|Tęcza
Cores da bandeira|Flag colours|Colores de la bandera|Couleurs du drapeau|Flaggenfarben|Kolory flagi
Cor da cara|Face colour|Color de la cara|Couleur du visage|Gesichtsfarbe|Kolor twarzy
Cor dos olhos|Eye colour|Color de los ojos|Couleur des yeux|Augenfarbe|Kolor oczu
Cor das bochechas|Cheek colour|Color de las mejillas|Couleur des joues|Wangenfarbe|Kolor policzków
Olhinhos|Eyes|Ojitos|Petits yeux|Äuglein|Oczka
Curiosos|Curious|Curiosos|Curieux|Neugierig|Ciekawskie
Grandalhões|Big eyes|Grandotes|Grands yeux|Große Augen|Duże oczy
Sorridentes|Happy|Alegres|Joyeux|Fröhlich|Wesołe
Sonhadores|Dreamy|Soñadores|Rêveurs|Verträumt|Rozmarzone
A piscar o olho|Winking|Guiñando|Clin d’œil|Zwinkernd|Mrugające
Estrelinhas|Little stars|Estrellitas|Petites étoiles|Sternchen|Gwiazdki
Óculos de sol|Sunglasses|Gafas de sol|Lunettes de soleil|Sonnenbrille|Okulary słoneczne
Boquinha|Mouth|Boquita|Petite bouche|Mund|Buzia
Sorriso|Smile|Sonrisa|Sourire|Lächeln|Uśmiech
Sorrisão|Big grin|Sonrisota|Grand sourire|Breites Grinsen|Szeroki uśmiech
Boquinha redonda|Round mouth|Boca redonda|Bouche ronde|Runder Mund|Okrągła buzia
Língua de fora|Tongue out|Lengua fuera|Langue tirée|Zunge raus|Wystawiony język
Sem boca|No mouth|Sin boca|Sans bouche|Ohne Mund|Bez buzi
Bochechas|Cheeks|Mejillas|Joues|Wangen|Policzki
Coradinhas|Rosy cheeks|Sonrojadas|Joues roses|Rote Wangen|Rumieńce
Sardinhas|Freckles|Pecas|Taches de rousseur|Sommersprossen|Piegi
Sem pintura|No face paint|Sin pintura|Sans maquillage|Ohne Bemalung|Bez malowania
Acessório|Accessory|Accesorio|Accessoire|Zubehör|Dodatek
Sem acessório|No accessory|Sin accesorio|Sans accessoire|Ohne Zubehör|Bez dodatku
Florzinha|Little flower|Florecita|Petite fleur|Blümchen|Kwiatek
Coroa|Crown|Corona|Couronne|Krone|Korona
Lacinho|Bow|Lacito|Petit nœud|Schleife|Kokardka
Boné|Cap|Gorra|Casquette|Kappe|Czapka
Rasto mágico|Magic trail|Rastro mágico|Traînée magique|Zauberspur|Magiczny ślad
Sem rasto|No trail|Sin rastro|Sans traînée|Ohne Spur|Bez śladu
Corações|Hearts|Corazones|Cœurs|Herzen|Serca
Bolhinhas|Bubbles|Burbujitas|Bulles|Bläschen|Bąbelki
Bandeiras|Flags|Banderas|Drapeaux|Flaggen|Flagi
Escolhe uma bandeira|Choose a flag|Elige una bandera|Choisis un drapeau|Wähle eine Flagge|Wybierz flagę
Sem bandeira|No flag|Sin bandera|Sans drapeau|Ohne Flagge|Bez flagi
Portugal|Portugal|Portugal|Portugal|Portugal|Portugalia
Brasil|Brazil|Brasil|Brésil|Brasilien|Brazylia
Reino Unido|United Kingdom|Reino Unido|Royaume-Uni|Vereinigtes Königreich|Wielka Brytania
França|France|Francia|France|Frankreich|Francja
Alemanha|Germany|Alemania|Allemagne|Deutschland|Niemcy
Espanha|Spain|España|Espagne|Spanien|Hiszpania
Polónia|Poland|Polonia|Pologne|Polen|Polska
Itália|Italy|Italia|Italie|Italien|Włochy
Ucrânia|Ukraine|Ucrania|Ukraine|Ukraine|Ukraina
Estados Unidos|United States|Estados Unidos|États-Unis|Vereinigte Staaten|Stany Zjednoczone
Criar a minha bandeira|Create my flag|Crear mi bandera|Créer mon drapeau|Meine Flagge gestalten|Stwórz moją flagę
Desenho da bandeira personalizada|Custom flag design|Diseño de bandera personal|Motif du drapeau personnalisé|Eigenes Flaggenmuster|Wzór własnej flagi
Riscas horizontais|Horizontal stripes|Rayas horizontales|Rayures horizontales|Waagerechte Streifen|Poziome paski
Riscas verticais|Vertical stripes|Rayas verticales|Rayures verticales|Senkrechte Streifen|Pionowe paski
Cruz|Cross|Cruz|Croix|Kreuz|Krzyż
Primeira cor da bandeira|First flag colour|Primer color de la bandera|Première couleur du drapeau|Erste Flaggenfarbe|Pierwszy kolor flagi
Segunda cor da bandeira|Second flag colour|Segundo color de la bandera|Deuxième couleur du drapeau|Zweite Flaggenfarbe|Drugi kolor flagi
Surpreende-me!|Surprise me!|¡Sorpréndeme!|Surprends-moi !|Überrasch mich!|Zaskocz mnie!
Recomeçar o visual|Reset outfit|Reiniciar aspecto|Réinitialiser la tenue|Outfit zurücksetzen|Zresetuj wygląd
Está mesmo gira!|Looks lovely!|¡Qué bonita!|C’est très joli !|Sieht toll aus!|Ale ładny!
O teu visual fica guardado nesta app.|Your outfit is saved in this app.|Tu aspecto se guarda en esta app.|Ta tenue est enregistrée dans cette appli.|Dein Outfit wird in dieser App gespeichert.|Twój wygląd zapisuje się w tej aplikacji.
Experimenta todas as combinações!|Try every combination!|¡Prueba todas las combinaciones!|Essaie toutes les combinaisons !|Probiere alle Kombinationen aus!|Wypróbuj wszystkie połączenia!
O TEU CANTINHO DE DESCOBERTAS|YOUR DISCOVERY CORNER|TU RINCÓN DE DESCUBRIMIENTOS|TON COIN DES DÉCOUVERTES|DEINE ENTDECKERECKE|TWÓJ KĄCIK ODKRYĆ
Pequenas aventuras|Little adventures|Pequeñas aventuras|Petites aventures|Kleine Abenteuer|Małe przygody
Autocolantes|Stickers|Pegatinas|Autocollants|Sticker|Naklejki
Skins especiais|Special outfits|Aspectos especiales|Tenues spéciales|Besondere Outfits|Wyjątkowe stroje
UMA SURPRESA COLORIDA|A COLOURFUL SURPRISE|UNA SORPRESA COLORIDA|UNE SURPRISE COLORÉE|EINE BUNTE ÜBERRASCHUNG|KOLOROWA NIESPODZIANKA
Roda da Sorte!|Lucky Wheel!|¡Rueda de la Suerte!|Roue de la chance !|Glücksrad!|Koło szczęścia!
Rodar grátis|Spin for free|Girar gratis|Tourner gratuitement|Kostenlos drehen|Zakręć za darmo
Uma oferta do jardim|A gift from the garden|Un regalo del jardín|Un cadeau du jardin|Ein Geschenk des Gartens|Prezent od ogrodu
Não custa moedas.|It costs no coins.|No cuesta monedas.|Cela ne coûte aucune pièce.|Es kostet keine Münzen.|Nie kosztuje monet.
A rodar…|Spinning…|Girando…|Ça tourne…|Dreht sich…|Kręci się…
Coleção completa!|Collection complete!|¡Colección completa!|Collection complète !|Sammlung komplett!|Kolekcja pełna!
Uma surpresa a caminho…|A surprise is on its way…|Una sorpresa en camino…|Une surprise arrive…|Eine Überraschung kommt…|Niespodzianka w drodze…
O progresso fica à tua espera. Continua quando quiseres|Your progress waits for you. Come back whenever you like|Tu progreso te espera. Sigue cuando quieras|Tes progrès t’attendent. Reviens quand tu veux|Dein Fortschritt wartet. Spiele weiter, wann du magst|Postępy poczekają. Wróć, kiedy chcesz
Um lanchinho|A little snack|Una merienda|Un petit goûter|Ein kleiner Snack|Mała przekąska
Apanha 5 alimentos.|Collect 5 foods.|Recoge 5 alimentos.|Ramasse 5 aliments.|Sammle 5 Lebensmittel.|Zbierz 5 smakołyków.
Artista do jardim|Garden artist|Artista del jardín|Artiste du jardin|Gartenkünstler|Artysta ogrodu
Guarda uma criação na oficina.|Save a creation in the workshop.|Guarda una creación en el taller.|Enregistre une création dans l’atelier.|Speichere eine Kreation in der Werkstatt.|Zapisz dzieło w pracowni.
Vamos passear|Let’s explore|Vamos de paseo|Allons nous promener|Auf Entdeckungstour|Chodźmy na spacer
Descobre 2 zonas do jardim.|Discover 2 garden areas.|Descubre 2 zonas del jardín.|Découvre 2 zones du jardin.|Entdecke 2 Gartenbereiche.|Odkryj 2 części ogrodu.
Cestinho de frutas|Fruit basket|Cesta de frutas|Panier de fruits|Obstkörbchen|Koszyk owoców
Apanha 25 alimentos, ao teu ritmo.|Collect 25 foods at your own pace.|Recoge 25 alimentos a tu ritmo.|Ramasse 25 aliments à ton rythme.|Sammle 25 Lebensmittel in deinem Tempo.|Zbierz 25 smakołyków w swoim tempie.
Uma paleta de ideias|A palette of ideas|Una paleta de ideas|Une palette d’idées|Eine Palette voller Ideen|Paleta pomysłów
Guarda criações com 3 padrões diferentes.|Save creations with 3 different patterns.|Guarda creaciones con 3 dibujos distintos.|Enregistre des créations avec 3 motifs différents.|Speichere Kreationen mit 3 verschiedenen Mustern.|Zapisz dzieła z 3 różnymi wzorami.
Conheço este jardim!|I know this garden!|¡Conozco este jardín!|Je connais ce jardin !|Ich kenne diesen Garten!|Znam ten ogród!
Explora as 4 zonas.|Explore all 4 areas.|Explora las 4 zonas.|Explore les 4 zones.|Erkunde alle 4 Bereiche.|Odkryj wszystkie 4 części.
Piquenique colorido|Colourful picnic|Pícnic de colores|Pique-nique coloré|Buntes Picknick|Kolorowy piknik
Apanha 75 alimentos no total.|Collect 75 foods in total.|Recoge 75 alimentos en total.|Ramasse 75 aliments au total.|Sammle insgesamt 75 Lebensmittel.|Zbierz łącznie 75 smakołyków.
Pequeno jardineiro|Little gardener|Pequeño jardinero|Petit jardinier|Kleiner Gärtner|Mały ogrodnik
Apanha 150 alimentos no total.|Collect 150 foods in total.|Recoge 150 alimentos en total.|Ramasse 150 aliments au total.|Sammle insgesamt 150 Lebensmittel.|Zbierz łącznie 150 smakołyków.
No álbum|In your album|En el álbum|Dans l’album|Im Album|W albumie
Receber|Collect|Recibir|Recevoir|Abholen|Odbierz
A descobrir|Keep exploring|Por descubrir|À découvrir|Noch zu entdecken|Do odkrycia
Uma descoberta tua!|Your discovery!|¡Tu descubrimiento!|Ta découverte !|Deine Entdeckung!|Twoje odkrycie!
Completa a aventura para colar.|Complete the adventure to add it.|Completa la aventura para pegarla.|Termine l’aventure pour le coller.|Beende das Abenteuer zum Einkleben.|Ukończ przygodę, aby ją wkleić.
Já é tua. Experimenta na oficina!|It’s yours. Try it in the workshop!|¡Ya es tuyo! Pruébalo en el taller.|C’est à toi. Essaie-le dans l’atelier !|Gehört dir. Probiere es in der Werkstatt!|Jest twój. Wypróbuj go w pracowni!
Vestir esta skin|Wear this outfit|Usar este aspecto|Porter cette tenue|Dieses Outfit tragen|Załóż ten strój
Ver aventura|View adventure|Ver aventura|Voir l’aventure|Abenteuer ansehen|Zobacz przygodę
Vestir · Já é tua|Wear · Already yours|Usar · Ya es tuyo|Porter · Déjà à toi|Tragen · Gehört dir|Załóż · Już twój
Obter por|Get for|Obtener por|Obtenir pour|Erhalten für|Odbierz za
Guardada na tua coleção.|Saved in your collection.|Guardado en tu colección.|Dans ta collection.|In deiner Sammlung gespeichert.|Zapisany w twojej kolekcji.
Algodão-doce|Candy floss|Algodón de azúcar|Barbe à papa|Zuckerwatte|Wata cukrowa
Abelhinha|Little bee|Abejita|Petite abeille|Bienchen|Pszczółka
Raio de sol|Sunbeam|Rayito de sol|Rayon de soleil|Sonnenstrahl|Promyk słońca
Joaninha|Ladybird|Mariquita|Coccinelle|Marienkäfer|Biedronka
Sereia|Mermaid|Sirena|Sirène|Meerjungfrau|Syrenka
Astronauta|Astronaut|Astronauta|Astronaute|Astronaut|Astronauta
Pêssego|Peach|Melocotón|Pêche|Pfirsich|Brzoskwinia
Dragão doce|Sweet dragon|Dragón dulce|Gentil dragon|Lieber Drache|Miły smok
Amora|Berry|Mora|Mûre|Brombeere|Jeżyna
Melancia|Watermelon|Sandía|Pastèque|Wassermelone|Arbuz
Nuvem|Cloud|Nube|Nuage|Wolke|Chmurka
Festa de cores|Colour party|Fiesta de colores|Fête des couleurs|Farbenfest|Święto kolorów
Festa|Party|Fiesta|Fête|Fest|Święto
Nível|Level|Nivel|Niveau|Stufe|Poziom
moedas|coins|monedas|pièces|Münzen|monety
descobertas até ao próximo nível|discoveries until the next level|descubrimientos hasta el próximo nivel|découvertes avant le prochain niveau|Entdeckungen bis zur nächsten Stufe|odkryć do kolejnego poziomu
Recompensa pronta|Reward ready|Recompensa lista|Récompense prête|Belohnung bereit|Nagroda gotowa
recompensas prontas|rewards ready|recompensas listas|récompenses prêtes|Belohnungen bereit|gotowe nagrody
recompensa pronta|reward ready|recompensa lista|récompense prête|Belohnung bereit|gotowa nagroda
Todas as aventuras descobertas!|All adventures discovered!|¡Todas las aventuras descubiertas!|Toutes les aventures découvertes !|Alle Abenteuer entdeckt!|Wszystkie przygody odkryte!
O meu álbum de descobertas|My discovery album|Mi álbum de descubrimientos|Mon album de découvertes|Mein Entdeckeralbum|Mój album odkryć
Surpresas do jardim|Garden surprises|Sorpresas del jardín|Surprises du jardin|Gartenüberraschungen|Niespodzianki ogrodu
A lojinha do jardim|The garden shop|La tienda del jardín|La boutique du jardin|Der Gartenladen|Sklepik ogrodu
Íman|Magnet|Imán|Aimant|Magnet|Magnes
Binóculos|Binoculars|Prismáticos|Jumelles|Fernglas|Lornetka
Sapatos|Shoes|Zapatillas|Chaussures|Schuhe|Buty
Campo das Flores|Flower Meadow|Campo de Flores|Champ de fleurs|Blumenwiese|Kwiecista łąka
Jardim das Cerejeiras|Cherry Garden|Jardín de Cerezos|Jardin des cerisiers|Kirschgarten|Wiśniowy ogród
Cantinho das Borboletas|Butterfly Corner|Rincón de Mariposas|Coin des papillons|Schmetterlingsecke|Kącik motyli
Bosque dos Sonhos|Dream Grove|Bosque de Sueños|Bois des rêves|Traumwäldchen|Gaj marzeń
TU|YOU|TÚ|TOI|DU|TY
Tu|You|Tú|Toi|Du|Ty
O TEU JARDIM|YOUR GARDEN|TU JARDÍN|TON JARDIN|DEIN GARTEN|TWÓJ OGRÓD
Uma nova voltinha! Já vais voltar|A fresh start! You’ll be back soon|¡Otra vuelta! Ya vuelves|Un nouveau tour ! Tu reviens bientôt|Eine neue Runde! Gleich geht’s weiter|Nowa runda! Zaraz wracasz
Uma cobrinha deixou pontinhos!|A snake left some points!|¡Una serpiente dejó puntos!|Un serpent a laissé des points !|Eine Schlange hat Punkte hinterlassen!|Wąż zostawił punkty!
Personalizar a cobrinha|Customize your snake|Personalizar serpiente|Personnaliser le serpent|Schlange gestalten|Dostosuj węża
Pausar|Pause|Pausar|Pause|Pausieren|Pauza
Cancelar e fechar|Cancel and close|Cancelar y cerrar|Annuler et fermer|Abbrechen und schließen|Anuluj i zamknij
Fechar aventuras|Close adventures|Cerrar aventuras|Fermer les aventures|Abenteuer schließen|Zamknij przygody
Arrasta para orientar|Drag to steer|Arrastra para dirigir|Glisse pour diriger|Zum Steuern ziehen|Przeciągnij, aby sterować
Aventura atual|Current adventure|Aventura actual|Aventure actuelle|Aktuelles Abenteuer|Obecna przygoda
Ajudas ativas|Active power-ups|Ayudas activas|Bonus actifs|Aktive Hilfen|Aktywne bonusy
Moedas|Coins|Monedas|Pièces|Münzen|Monety
moeda|coin|moneda|pièce|Münze|moneta
Livro de descobertas|Discovery book|Libro de descubrimientos|Livre des découvertes|Entdeckerbuch|Księga odkryć
RESULTADO|RESULT|RESULTADO|RÉSULTAT|ERGEBNIS|WYNIK
POSIÇÃO|RANK|POSICIÓN|CLASSEMENT|PLATZ|MIEJSCE
Maior pontuação|Highest score|Mayor puntuación|Meilleur score|Höchste Punktzahl|Najwyższy wynik
Eliminações|Knockouts|Eliminaciones|Éliminations|Ausscheidungen|Wyeliminowani
Tempo de jogo|Game duration|Tiempo de juego|Durée de jeu|Spieldauer|Czas gry
Moedas recolhidas|Coins collected|Monedas recogidas|Pièces ramassées|Gesammelte Münzen|Zebrane monety
Menu principal|Main menu|Menú principal|Menu principal|Hauptmenü|Menu główne
JOGAR OUTRA VEZ|PLAY AGAIN|JUGAR OTRA VEZ|REJOUER|NOCH MAL SPIELEN|ZAGRAJ PONOWNIE
Melhorias|Upgrades|Mejoras|Améliorations|Verbesserungen|Ulepszenia
Melhoria guardada!|Upgrade saved!|¡Mejora guardada!|Amélioration enregistrée !|Verbesserung gespeichert!|Ulepszenie zapisane!
Laboratório|Laboratory|Laboratorio|Laboratoire|Labor|Laboratorium
Categorias de skins|Outfit categories|Categorías de aspectos|Catégories de tenues|Outfit-Kategorien|Kategorie strojów
Todas|All|Todas|Toutes|Alle|Wszystkie
Comuns|Common|Comunes|Communes|Gewöhnlich|Zwykłe
Raras|Rare|Raras|Rares|Selten|Rzadkie
Épicas|Epic|Épicas|Épiques|Episch|Epickie
Lendárias|Legendary|Legendarias|Légendaires|Legendär|Legendarne
Criar a minha cobra|Make my own snake|Crear mi serpiente|Créer mon serpent|Meine Schlange gestalten|Stwórz własnego węża
USAR|USE|USAR|UTILISER|BENUTZEN|UŻYJ
Desbloquear|Unlock|Desbloquear|Débloquer|Freischalten|Odblokuj
RODAR!|SPIN!|¡GIRAR!|TOURNER !|DREHEN!|ZAKRĘĆ!
Joga para rodar outra vez|Play to spin again|Juega para volver a girar|Joue pour tourner à nouveau|Spiele, um erneut zu drehen|Zagraj, aby zakręcić ponownie
Prémios em moedas|Coin prizes|Premios en monedas|Prix en pièces|Münzpreise|Nagrody w monetach
Uma oferta por partida. Todos os prémios têm a mesma possibilidade de sair.|One gift per round. All prizes have an equal chance.|Un regalo por partida. Todos los premios tienen la misma probabilidad.|Un cadeau par partie. Tous les prix ont la même chance.|Ein Geschenk pro Runde. Alle Preise sind gleich wahrscheinlich.|Jeden prezent na rundę. Każda nagroda ma taką samą szansę.
Grátis. Sem anúncios. Sem gastar moedas.|Free. No ads. No coins needed.|Gratis. Sin anuncios. Sin gastar monedas.|Gratuit. Sans publicité. Sans dépenser de pièces.|Kostenlos. Ohne Werbung. Ohne Münzeinsatz.|Za darmo. Bez reklam. Bez wydawania monet.
Cenourinha|Little carrot|Zanahorita|Petite carotte|Möhrchen|Marchewka
Chocolate|Chocolate|Chocolate|Chocolat|Schokolade|Czekolada
Milhinho|Sweetcorn|Maicito|Petit maïs|Mais|Kukurydza
Gatinho|Kitten|Gatito|Chaton|Kätzchen|Kotek
Cristal de gelo|Ice crystal|Cristal de hielo|Cristal de glace|Eiskristall|Kryształ lodu
Fénix|Phoenix|Fénix|Phénix|Phönix|Feniks
Opções do jogo|Game options|Opciones del juego|Options du jeu|Spieloptionen|Opcje gry
Opções|Options|Opciones|Options|Optionen|Opcje
Cenário|Background|Escenario|Décor|Hintergrund|Tło
O teu jardim|Your garden|Tu jardín|Ton jardin|Dein Garten|Twój ogród
Ritmo da aventura|Adventure pace|Ritmo de la aventura|Rythme de l’aventure|Abenteuertempo|Tempo przygody
Escolhe como queres explorar.|Choose how you want to explore.|Elige cómo explorar.|Choisis comment explorer.|Wähle dein Entdeckertempo.|Wybierz, jak chcesz odkrywać.
Devagarinho|Nice and slow|Despacio|Tout doucement|Ganz gemütlich|Powoli
Mais aventura|More adventure|Más aventura|Plus d’aventure|Mehr Abenteuer|Więcej przygód
Move o rato, usa as setas ou arrasta o dedo. Para acelerar, mantém Espaço, Shift ou o botão do rato premido.|Move the mouse, use the arrows or drag your finger. Hold Space, Shift or the mouse button to speed up.|Mueve el ratón, usa las flechas o arrastra el dedo. Mantén Espacio, Shift o el botón del ratón para acelerar.|Bouge la souris, utilise les flèches ou glisse le doigt. Maintiens Espace, Maj ou le bouton de la souris pour accélérer.|Bewege die Maus, nutze die Pfeiltasten oder ziehe den Finger. Halte Leertaste, Umschalt oder die Maustaste zum Beschleunigen.|Poruszaj myszą, używaj strzałek lub przeciągaj palcem. Przytrzymaj Spację, Shift lub przycisk myszy, aby przyspieszyć.
Escolhe o teu cenário|Choose your background|Elige tu escenario|Choisis ton décor|Wähle deinen Hintergrund|Wybierz swoje tło
Azul do céu|Sky blue|Azul del cielo|Bleu du ciel|Himmelblau|Błękit nieba
Mar de bolhinhas|Bubble sea|Mar de burbujas|Mer de bulles|Bläschenmeer|Bąbelkowe morze
Jardim verde|Green garden|Jardín verde|Jardin vert|Grüner Garten|Zielony ogród
As opções ficam ativas nesta sessão.|Options stay active for this session.|Las opciones quedan activas en esta sesión.|Les options restent actives pour cette session.|Die Optionen bleiben für diese Sitzung aktiv.|Opcje pozostają aktywne w tej sesji.
Skins prontas|Ready-made outfits|Aspectos listos|Tenues prêtes|Fertige Outfits|Gotowe stroje
Docinho|Sweetie|Dulce|Bonbon|Süßchen|Słodziak
Oceano|Ocean|Océano|Océan|Ozean|Ocean
A tua cobrinha personalizada|Your customized snake|Tu serpiente personalizada|Ton serpent personnalisé|Deine gestaltete Schlange|Twój spersonalizowany wąż
Pré-visualização animada da tua cobrinha|Animated preview of your snake|Vista animada de tu serpiente|Aperçu animé de ton serpent|Animierte Vorschau deiner Schlange|Animowany podgląd twojego węża
Arena de cobrinhas. Usa as setas ou arrasta o dedo para orientar a tua cobrinha.|Snake arena. Use the arrows or drag your finger to steer.|Arena de serpientes. Usa las flechas o arrastra el dedo para dirigir.|Arène de serpents. Utilise les flèches ou glisse le doigt pour diriger.|Schlangenarena. Steuere mit Pfeiltasten oder ziehe deinen Finger.|Arena węży. Steruj strzałkami lub przeciągaj palcem.
Clareira dos Trevos|Clover Clearing|Claro de Tréboles|Clairière des trèfles|Kleelichtung|Polana koniczyny
Vale dos Girassóis|Sunflower Valley|Valle de Girasoles|Vallée des tournesols|Sonnenblumental|Dolina słoneczników
segundos!|seconds!|¡segundos!|secondes !|Sekunden!|sekund!
Tocaste na borda! A tua cobra foi eliminada. Fizeste|You touched the border! Your snake is out. You scored|¡Tocaste el borde! Tu serpiente queda eliminada. Lograste|Tu as touché la bordure ! Ton serpent est éliminé. Tu as marqué|Du hast den Rand berührt! Deine Schlange scheidet aus. Du hast|Dotknięto brzegu! Twój wąż odpada. Zdobyte punkty:
pontos. Vamos tentar outra vez?|points. Shall we try again?|puntos. ¿Lo intentamos otra vez?|points. On réessaie ?|Punkte erreicht. Noch ein Versuch?|punktów. Spróbujemy ponownie?
está pronta para brincar!|is ready to play!|¡listo para jugar!|est prêt à jouer !|ist spielbereit!|jest gotowy do zabawy!
já é tua! Podes vesti-la quando quiseres.|is yours! Wear it whenever you like.|¡ya es tuyo! Úsalo cuando quieras.|est à toi ! Porte-le quand tu veux.|gehört dir! Trage es, wann du magst.|jest twój! Załóż go, kiedy chcesz.
Custa|Costs|Cuesta|Coûte|Kostet|Kosztuje
moedas das aventuras. Sem dinheiro real.|adventure coins. No real money.|monedas de aventuras. Sin dinero real.|pièces d’aventure. Sans argent réel.|Abenteuermünzen. Kein echtes Geld.|monet z przygód. Bez prawdziwych pieniędzy.
Ganhaste a skin|You won the outfit|Ganaste el aspecto|Tu as gagné la tenue|Du hast das Outfit gewonnen:|Wygrany strój:
Já ficou guardada.|It has been saved.|Ya está guardado.|Elle est enregistrée.|Es wurde gespeichert.|Zapisano go.
Boa descoberta! Ganhaste|Great discovery! You earned|¡Buen descubrimiento! Ganaste|Belle découverte ! Tu as gagné|Tolle Entdeckung! Du bekommst|Świetne odkrycie! Nagroda:
moedas e o autocolante|coins and the sticker|monedas y la pegatina|pièces et l’autocollant|Münzen und den Sticker|monet i naklejka
e a skin|and the outfit|y el aspecto|et la tenue|und das Outfit|oraz strój
Recompensa de|Reward for|Recompensa de|Récompense de|Belohnung für|Nagroda za
4 skins de oferta, sem repetições. As skins que faltam têm a mesma possibilidade de sair.|4 free outfits, no repeats. Each remaining outfit has an equal chance.|4 aspectos gratis, sin repetir. Todos los que faltan tienen la misma probabilidad.|4 tenues offertes, sans doublons. Chaque tenue restante a la même chance.|4 kostenlose Outfits, keine Wiederholungen. Jedes übrige Outfit hat die gleiche Chance.|4 darmowe stroje bez powtórek. Każdy pozostały strój ma taką samą szansę.
Escolhe «Criar a minha bandeira» para usar as tuas cores. O padrão do corpo também pode usar as cores da bandeira.|Choose “Create my flag” to use your colours. Your body pattern can use the flag colours too.|Elige «Crear mi bandera» para usar tus colores. El cuerpo también puede usar esos colores.|Choisis «Créer mon drapeau» pour utiliser tes couleurs. Le corps peut aussi utiliser ces couleurs.|Wähle „Meine Flagge gestalten“ für deine Farben. Auch das Körpermuster kann diese Farben nutzen.|Wybierz „Stwórz moją flagę”, aby użyć swoich kolorów. Wzór ciała też może ich używać.
Cada descoberta faz o teu jardim crescer.|Every discovery helps your garden grow.|Cada descubrimiento hace crecer tu jardín.|Chaque découverte fait grandir ton jardin.|Jede Entdeckung lässt deinen Garten wachsen.|Każde odkrycie rozwija twój ogród.
O visual está aplicado, mas não foi possível guardá-lo.|Your outfit is applied, but could not be saved.|Tu aspecto está aplicado, pero no se pudo guardar.|Ta tenue est appliquée, mais n’a pas pu être enregistrée.|Dein Outfit ist aktiv, konnte aber nicht gespeichert werden.|Wygląd zastosowany, ale nie udało się go zapisać.
O progresso está nesta partida; não foi possível guardá-lo no dispositivo.|Your progress is in this round; it could not be saved on this device.|Tu progreso está en esta partida; no se pudo guardar en el dispositivo.|Tes progrès sont dans cette partie ; impossible de les enregistrer sur cet appareil.|Dein Fortschritt ist in dieser Runde; er konnte nicht auf dem Gerät gespeichert werden.|Postępy są w tej rundzie; nie udało się ich zapisać na urządzeniu.
Podes brincar. O progresso desta partida pode não ficar guardado.|You can play. Progress from this round might not be saved.|Puedes jugar. Puede que el progreso de esta partida no se guarde.|Tu peux jouer. Les progrès de cette partie risquent de ne pas être enregistrés.|Du kannst spielen. Der Fortschritt dieser Runde wird vielleicht nicht gespeichert.|Możesz grać. Postępy z tej rundy mogą nie zostać zapisane.
`;
  const workshopRows =
    "\nOficina|Workshop|Taller|Atelier|Werkstatt|Warsztat\nCorpo|Body|Cuerpo|Corps|Körper|Ciało\nOlhos|Eyes|Ojos|Yeux|Augen|Oczy\nBoca|Mouth|Boca|Bouche|Mund|Usta\nAcessórios|Accessories|Accesorios|Accessoires|Zubehör|Akcesoria\nMelhorias|Upgrades|Mejoras|Améliorations|Verbesserungen|Ulepszenia\nReações|Reactions|Reacciones|Réactions|Reaktionen|Reakcje\nEfeitos|Effects|Efectos|Effets|Effekte|Efekty\nBandeiras|Flags|Banderas|Drapeaux|Flaggen|Flagi\nForma do corpo|Body shape|Forma del cuerpo|Forme du corps|Körperform|Kształt ciała\nUsar esta cobrinha|Use this snake|Usar esta serpiente|Utiliser ce serpent|Diese Schlange verwenden|Użyj tego węża\nSelecionada|Selected|Seleccionada|Sélectionnée|Ausgewählt|Wybrana\nSelecionado|Selected|Seleccionado|Sélectionné|Ausgewählt|Wybrane\nColeção de skins|Skin collection|Colección de aspectos|Collection de skins|Skin-Sammlung|Kolekcja skórek\nExperimenta e carrega em Usar para guardar.|Try things out, then press Use to save.|Prueba y pulsa Usar para guardar.|Essaie puis appuie sur Utiliser pour enregistrer.|Probiere es aus und drücke Verwenden zum Speichern.|Wypróbuj i naciśnij Użyj, aby zapisać.\nA tua criação ficou guardada!|Your creation is saved!|¡Tu creación está guardada!|Ta création est enregistrée !|Deine Kreation ist gespeichert!|Twój projekt został zapisany!\nCor da cabeça|Head color|Color de la cabeza|Couleur de la tête|Kopffarbe|Kolor głowy\nCor dos olhos|Eye color|Color de ojos|Couleur des yeux|Augenfarbe|Kolor oczu\nCor das bochechas|Cheek color|Color de mejillas|Couleur des joues|Wangenfarbe|Kolor policzków\nCor do corpo|Body color|Color del cuerpo|Couleur du corps|Körperfarbe|Kolor ciała\nSegunda cor|Second color|Segundo color|Deuxième couleur|Zweite Farbe|Drugi kolor\nRedondo|Round|Redondo|Rond|Rund|Okrągły\nQuadrado|Square|Cuadrado|Carré|Quadratisch|Kwadratowy\nCristal|Crystal|Cristal|Cristal|Kristall|Kryształ\nClássicos|Classic|Clásicos|Classiques|Klassisch|Klasyczne\nGrandes|Big|Grandes|Grands|Groß|Duże\nFelizes|Happy|Felices|Joyeux|Fröhlich|Wesołe\nSonolentos|Sleepy|Dormilones|Endormis|Schläfrig|Śpiące\nPiscadela|Wink|Guiño|Clin d’œil|Zwinkern|Mrugnięcie\nDentinhos|Toothy|Dientecitos|Petites dents|Zähnchen|Ząbki\nSurpresa|Surprise|Sorpresa|Surprise|Überraschung|Zaskoczenie\nLíngua|Tongue|Lengua|Langue|Zunge|Język\nSem reação|No reaction|Sin reacción|Sans réaction|Keine Reaktion|Bez reakcji\nSem efeito|No effect|Sin efecto|Sans effet|Kein Effekt|Bez efektu\nCarinho|Love|Cariño|Affection|Liebe|Miłość\nUau!|Wow!|¡Guau!|Ouah !|Wow!|Wow!\nConsegui!|I did it!|¡Lo logré!|J’ai réussi !|Geschafft!|Udało się!\nBolhas mágicas|Magic bubbles|Burbujas mágicas|Bulles magiques|Zauberblasen|Magiczne bańki\nCristais|Crystals|Cristales|Cristaux|Kristalle|Kryształy\nEstrelinhas|Little stars|Estrellitas|Petites étoiles|Sternchen|Gwiazdki\nRaios de sol|Sunbeams|Rayos de sol|Rayons de soleil|Sonnenstrahlen|Promienie słońca\nAtrai alimentos de mais longe.|Attracts food from further away.|Atrae comida desde más lejos.|Attire la nourriture de plus loin.|Zieht Nahrung aus größerer Entfernung an.|Przyciąga jedzenie z większej odległości.\nMantém a visão alargada durante mais tempo.|Keeps the wider view for longer.|Mantiene la vista ampliada más tiempo.|Garde la vue élargie plus longtemps.|Behält die weitere Sicht länger bei.|Utrzymuje szerszy widok na dłużej.\nMantém a velocidade extra durante mais tempo.|Keeps the extra speed for longer.|Mantiene la velocidad extra más tiempo.|Garde la vitesse supplémentaire plus longtemps.|Behält das zusätzliche Tempo länger bei.|Utrzymuje dodatkową prędkość na dłużej.\nAumenta o valor das moedas que apanhas.|Increases the value of collected coins.|Aumenta el valor de las monedas recogidas.|Augmente la valeur des pièces ramassées.|Erhöht den Wert gesammelter Münzen.|Zwiększa wartość zbieranych monet.\nAs bandeiras são gratuitas. Escolhe uma e fica logo aplicada.|Flags are free. Choose one to apply it.|Las banderas son gratis. Elige una para aplicarla.|Les drapeaux sont gratuits. Choisis-en un pour l’appliquer.|Flaggen sind kostenlos. Wähle eine zum Anwenden.|Flagi są bezpłatne. Wybierz jedną, aby ją zastosować.\nMáximo|Maximum|Máximo|Maximum|Maximum|Maksimum\nMostrar a minha reação|Show my reaction|Mostrar mi reacción|Afficher ma réaction|Meine Reaktion zeigen|Pokaż moją reakcję\nVoltar ao menu|Back to menu|Volver al menú|Retour au menu|Zurück zum Menü|Powrót do menu\nPré-visualização da tua cobrinha|Your snake preview|Vista previa de tu serpiente|Aperçu de ton serpent|Vorschau deiner Schlange|Podgląd twojego węża\n";
  const packs = Object.fromEntries(languages.map((l) => [l, {}]));
  for (const row of (rows + workshopRows).trim().split("\n")) {
    const [pt, ...values] = row.split("|");
    ["en", "es", "fr", "de", "pl"].forEach(
      (l, i) => (packs[l][pt] = values[i]),
    );
  }
  Object.assign(packs["pt-BR"], {
    "AS TUAS FRUTINHAS": "SUAS FRUTINHAS",
    "O TEU RECORDE": "SEU RECORDE",
    "Qual é a tua cobrinha?": "Qual é a sua cobrinha?",
    "A tua criação": "Sua criação",
    "O meu álbum": "Meu álbum",
    autocolantes: "adesivos",
    Autocolantes: "Adesivos",
    "Troca as tuas moedas": "Troque suas moedas",
    Estás: "Você está",
    "Está mesmo gira!": "Ficou linda!",
    Guarda: "Salve",
    Apanha: "Pegue",
    "Cor do padrão": "Cor do padrão",
    "Riscas coloridas": "Listras coloridas",
    "Riscas horizontais": "Listras horizontais",
    "Riscas verticais": "Listras verticais",
    "Rasto mágico": "Rastro mágico",
    "Sem rasto": "Sem rastro",
    Íman: "Ímã",
    "O teu visual fica guardado nesta app.":
      "Seu visual fica salvo neste aplicativo.",
    "Experimenta todas as combinações!": "Experimente todas as combinações!",
    "Sem pressa. Tenta outra vez sempre!": "Sem pressa. Tente de novo sempre!",
    "Sem Internet · Sem anúncios · Adversárias do computador":
      "Sem Internet · Sem anúncios · Adversárias do computador",
  });
  function normalize(value) {
    const code = String(value || "")
      .replace("_", "-")
      .toLowerCase();
    if (code === "pt-br") return "pt-BR";
    if (code === "pt" || code.startsWith("pt-")) return "pt-PT";
    return languages.find((l) => l === code.split("-")[0]) || "pt-PT";
  }
  let language = "pt-PT";
  const sourceText = new WeakMap(),
    sourceAttributes = new WeakMap();
  const compiled = new Map();
  function t(text) {
    const raw = String(text),
      pack = packs[language];
    if (!pack || language === "pt-PT") return raw;
    // Longest first, single pass: translated fragments never get translated twice.
    if (pack[raw.trim()]) return raw.replace(raw.trim(), pack[raw.trim()]);
    let pattern = compiled.get(language);
    if (!pattern) {
      const keys = Object.keys(pack)
        .filter((k) => k.length > 2)
        .sort((a, b) => b.length - a.length);
      pattern = new RegExp(
        "(?<![\\p{L}])(?:" +
          keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
          ")(?![\\p{L}])",
        "gu",
      );
      compiled.set(language, pattern);
    }
    return raw.replace(pattern, (match) => pack[match]);
  }
  function translate(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      if (node.parentElement?.closest("script,style,svg,code")) return;
      const previous = sourceText.get(node);
      const original =
        previous && node.nodeValue === previous.output
          ? previous.input
          : node.nodeValue;
      const output = t(original.replace(/\s+/g, " "));
      sourceText.set(node, { input: original, output });
      if (node.nodeValue !== output) node.nodeValue = output;
    } else {
      if (node.nodeType === 1) {
        if (node.matches("script,style,svg,code")) return;
        const saved = sourceAttributes.get(node) || {};
        for (const attr of ["aria-label", "title", "alt", "placeholder"]) {
          if (!node.hasAttribute(attr)) continue;
          const value = node.getAttribute(attr),
            old = saved[attr];
          const input = old && old.output === value ? old.input : value;
          const output = t(input);
          saved[attr] = { input, output };
          if (value !== output) node.setAttribute(attr, output);
        }
        sourceAttributes.set(node, saved);
      }
      for (const child of node.childNodes || []) translate(child);
    }
  }
  function setLanguage(value) {
    language = normalize(value);
    if (root.document) {
      document.documentElement.lang = language;
      translate(document.documentElement);
    }
    return language;
  }
  root.GardenI18n = {
    t,
    setLanguage,
    normalize,
    languages,
    get language() {
      return language;
    },
  };
  if (!root.document) return;
  // Wait for the SDK language in a sandbox, rather than briefly showing the browser language.
  setLanguage(
    root.parent !== root
      ? "pt-PT"
      : new URLSearchParams(root.location.search).get("lang") ||
          root.navigator.language,
  );
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translate(record.target);
      else if (record.type === "attributes") translate(record.target);
      else for (const node of record.addedNodes) translate(node);
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "title", "alt", "placeholder"],
  });
})(typeof window === "undefined" ? globalThis : window);
