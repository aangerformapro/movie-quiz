
/**
 * Material Design Custom SVG Sprite
 */
const parser = document.createElement('div');
parser.innerHTML = `<svg width="0" height="0" style="display: none;" id="ng-sprite"></svg>`;

// generate the shadowroot
const sprite = document.querySelector('#ng-sprite') ?? parser.removeChild(parser.firstChild);

// all the icons that can be injected
const icons = {"ng-app-shortcut":{"symbol":"<symbol id=\"ng-app-shortcut\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M260-40q-24.75 0-42.375-17.625T200-100v-760q0-24.75 17.625-42.375T260-920h440q24.75 0 42.375 17.625T760-860v146h-60v-56H260v580h440v-56h60v146q0 24.75-17.625 42.375T700-40H260Zm0-90v30h440v-30H260Zm0-700h440v-30H260v30Zm0 0v-30 30Zm0 700v30-30Zm466-321H460v151h-60v-151q0-24.75 17.625-42.375T460-511h266l-82-81 42-42 153 153-153 153-42-42 82-81Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-app-shortcut\"></use></svg>"},"ng-arrow-drop-down":{"symbol":"<symbol id=\"ng-arrow-drop-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-360 280-559h400L480-360Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-arrow-drop-down\"></use></svg>"},"ng-arrow-selector-tool":{"symbol":"<symbol id=\"ng-arrow-selector-tool\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m300-347 109-153h218L300-757v410ZM560-84 412-401 240-160v-720l560 440H505l145 314-90 42ZM409-500Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-arrow-selector-tool\"></use></svg>"},"ng-backspace":{"symbol":"<symbol id=\"ng-backspace\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m448-326 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43ZM120-480l169-239q13-18 31-29.5t40-11.5h420q24.75 0 42.375 17.625T840-700v440q0 24.75-17.625 42.375T780-200H360q-22 0-40-11.5T289-241L120-480Zm75 0 154 220h431v-440H349L195-480Zm585 0v-220 440-220Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-backspace\"></use></svg>"},"ng-bookmark-add":{"symbol":"<symbol id=\"ng-bookmark-add\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Zm440 180v-90h-90v-60h90v-90h60v90h90v60h-90v90h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-add\"></use></svg>"},"ng-bookmark-added":{"symbol":"<symbol id=\"ng-bookmark-added\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M716-605 610-711l42-43 64 64 148-149 43 43-191 191ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-added\"></use></svg>"},"ng-bookmark-remove":{"symbol":"<symbol id=\"ng-bookmark-remove\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M850-695H610v-60h240v60ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-remove\"></use></svg>"},"ng-bookmark":{"symbol":"<symbol id=\"ng-bookmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-120v-665q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480-240 200-120Zm60-91 220-93 220 93v-574H260v574Zm0-574h440-440Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark\"></use></svg>"},"ng-bookmarks":{"symbol":"<symbol id=\"ng-bookmarks\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-40v-700q0-24 18-42t42-18h480q24 0 42.5 18t18.5 42v700L420-167 120-40Zm60-91 240-103 240 103v-609H180v609Zm600 1v-730H233v-60h547q24 0 42 18t18 42v730h-60ZM180-740h480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmarks\"></use></svg>"},"ng-cancel":{"symbol":"<symbol id=\"ng-cancel\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-cancel\"></use></svg>"},"ng-check-box-outline-blank":{"symbol":"<symbol id=\"ng-check-box-outline-blank\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-box-outline-blank\"></use></svg>"},"ng-check-box":{"symbol":"<symbol id=\"ng-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-box\"></use></svg>"},"ng-check-circle":{"symbol":"<symbol id=\"ng-check-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-circle\"></use></svg>"},"ng-chevron-left":{"symbol":"<symbol id=\"ng-chevron-left\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-left\"></use></svg>"},"ng-chevron-right":{"symbol":"<symbol id=\"ng-chevron-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-right\"></use></svg>"},"ng-close":{"symbol":"<symbol id=\"ng-close\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-close\"></use></svg>"},"ng-disabled-by-default":{"symbol":"<symbol id=\"ng-disabled-by-default\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-disabled-by-default\"></use></svg>"},"ng-dock-to-bottom":{"symbol":"<symbol id=\"ng-dock-to-bottom\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm0-207v147h600v-147H180Zm0-60h600v-393H180v393Zm0 60v147-147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-bottom\"></use></svg>"},"ng-dock-to-left":{"symbol":"<symbol id=\"ng-dock-to-left\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm453-60h147v-600H633v600Zm-60 0v-600H180v600h393Zm60 0h147-147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-left\"></use></svg>"},"ng-dock-to-right":{"symbol":"<symbol id=\"ng-dock-to-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm147-60v-600H180v600h147Zm60 0h393v-600H387v600Zm-60 0H180h147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-right\"></use></svg>"},"ng-done":{"symbol":"<symbol id=\"ng-done\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-done\"></use></svg>"},"ng-drag-pan":{"symbol":"<symbol id=\"ng-drag-pan\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80 317-243l44-44 89 89v-252H198l84 84-44 44L80-480l159-159 44 44-85 85h252v-252l-84 84-44-44 158-158 158 158-44 44-84-84v252h252l-84-84 44-44 158 158-158 158-44-44 84-84H510v252l89-89 44 44L480-80Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-drag-pan\"></use></svg>"},"ng-expand-circle-down":{"symbol":"<symbol id=\"ng-expand-circle-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m480-351 173-173-43-42-130 130-130-130-43 42 173 173Zm0 271q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-circle-down\"></use></svg>"},"ng-expand-circle-up":{"symbol":"<symbol id=\"ng-expand-circle-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m350-394 130-130 130 130 43-42-173-173-173 173 43 42ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-155.5t85.5-127q54-54.5 127-86T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 83-31.5 156t-86 127q-54.5 54-127 85.5T480-80Zm0-60q141 0 240.5-99T820-480q0-141-99.5-240.5T480-820q-142 0-241 99.5T140-480q0 142 99 241t241 99Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-circle-up\"></use></svg>"},"ng-expand-less":{"symbol":"<symbol id=\"ng-expand-less\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-less\"></use></svg>"},"ng-expand-more":{"symbol":"<symbol id=\"ng-expand-more\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-more\"></use></svg>"},"ng-fast-forward":{"symbol":"<symbol id=\"ng-fast-forward\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240ZM164-480Zm407 0ZM164-355l181-125-181-125v250Zm407 0 181-125-181-125v250Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fast-forward\"></use></svg>"},"ng-fast-rewind":{"symbol":"<symbol id=\"ng-fast-rewind\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M854-240 508-480l346-240v480Zm-402 0L106-480l346-240v480Zm-60-240Zm402 0ZM392-355v-250L211-480l181 125Zm402 0v-250L613-480l181 125Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fast-rewind\"></use></svg>"},"ng-favorite-full":{"symbol":"<symbol id=\"ng-favorite-full\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-favorite-full\"></use></svg>"},"ng-favorite":{"symbol":"<symbol id=\"ng-favorite\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m480-121-41-37q-105.768-97.121-174.884-167.561Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.155 60.5-150.577Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.423Q880-733.155 880-643q0 46-16.5 91T806-451.5Q765-396 695.884-325.561 626.768-255.121 521-158l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712-426 750.5-476t54-89.135q15.5-39.136 15.5-77.72Q820-709 778-751.5T670.225-794q-51.524 0-95.375 31.5Q531-731 504-674h-49q-26-56-69.85-88-43.851-32-95.375-32Q224-794 182-751.5t-42 108.816Q140-604 155.5-564.5t54 90Q248-424 314-358t166 158Zm0-297Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-favorite\"></use></svg>"},"ng-filter-list":{"symbol":"<symbol id=\"ng-filter-list\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M400-240v-60h160v60H400ZM240-450v-60h480v60H240ZM120-660v-60h720v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-filter-list\"></use></svg>"},"ng-fingerprint":{"symbol":"<symbol id=\"ng-fingerprint\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M123-584q-4-2-4-6.5t2-8.5q62-86 157-133t203-47q108 0 203.5 46T843-601q3 5 2.5 8t-3.5 6q-3 3-7.5 3t-8.5-5q-59-82-150.5-126T481-759q-103 0-193 44.5T138-589q-4 5-7.5 6t-7.5-1ZM600-81q-103-26-169.5-103T364-371q0-47 34.5-79t82.5-32q48 0 82.5 32t34.5 79q0 38 29.5 64t68.5 26q38 0 66.5-26t28.5-64q0-123-91.5-206T481-660q-127 0-218.5 83T171-371q0 24 5.5 62.5T200-221q2 5 0 7.5t-5 4.5q-4 2-8.5 1t-6.5-6q-13-38-20.5-77.5T152-371q0-129 98-220.5T481-683q136 0 233.5 90T812-371q0 46-34 78t-82 32q-49 0-84-32t-35-78q0-39-28.5-65T481-462q-39 0-68 26t-29 65q0 104 63 173.5T604-100q6 2 7.5 5t.5 7q-1 5-4 7t-8 0ZM247-801q-5 2-7.5.5T235-805q-2-2-2-6t3-6q57-31 119.5-47T481-880q65 0 127.5 16T728-819q5 2 5.5 6t-1.5 7q-2 3-5.5 5t-8.5 0q-55-27-115-42.5T481-859q-62 0-121 14.5T247-801ZM381-92q-58-60-90.5-126T258-371q0-89 65.5-150T481-582q92 0 158.5 61T706-371q0 5-2.5 7.5T696-361q-5 0-8-2.5t-3-7.5q0-81-60.5-136T481-562q-83 0-142.5 55T279-371q0 85 29.5 145T396-106q4 4 3.5 7.5T396-92q-2 2-6.5 3.5T381-92Zm306-73q-88 0-152.5-58.5T470-371q0-5 2.5-8t7.5-3q5 0 7.5 3t2.5 8q0 81 59.5 133.5T687-185q8 0 19-1t24-3q5-1 8 1.5t4 5.5q1 4-.5 7t-6.5 4q-18 5-31.5 5.5t-16.5.5Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fingerprint\"></use></svg>"},"ng-fullscreen-exit":{"symbol":"<symbol id=\"ng-fullscreen-exit\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M333-200v-133H200v-60h193v193h-60Zm234 0v-193h193v60H627v133h-60ZM200-567v-60h133v-133h60v193H200Zm367 0v-193h60v133h133v60H567Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fullscreen-exit\"></use></svg>"},"ng-fullscreen":{"symbol":"<symbol id=\"ng-fullscreen\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-200v-193h60v133h133v60H200Zm0-367v-193h193v60H260v133h-60Zm367 367v-60h133v-133h60v193H567Zm133-367v-133H567v-60h193v193h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fullscreen\"></use></svg>"},"ng-heart-minus":{"symbol":"<symbol id=\"ng-heart-minus\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M440-497Zm0 376-99-91q-94-86-152.5-145.5T97-462q-33-45-45-83t-12-80q0-91 61-153t149-62q57 0 105.5 26.5T440-736q41-53 88-78.5T630-840q88 0 148.5 62T839-625q0 29-5.5 54.5T820-530h-64q8-17 15.5-44.5T779-625q0-64-43.5-109.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-65 0-107.5 44T100-625q0 36 12.5 70t49 80Q198-429 265-364t175 164q32-29 60.5-54t56.5-49l6.5 6.5q6.5 6.5 14.5 14t14.5 14l6.5 6.5q-27 24-56 49t-62 55l-41 37Zm160-289v-60h320v60H600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-heart-minus\"></use></svg>"},"ng-heart-plus":{"symbol":"<symbol id=\"ng-heart-plus\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M440-497Zm0 376-99-91q-87-80-144.5-137T104-452q-35-46-49.5-86.5T40-625q0-90 60.5-152.5T250-840q57 0 105.5 26.5T440-736q42-54 89-79t101-25q80.576 0 135.288 55Q820-730 832-652h-59q-9-55-46.5-91.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-66 0-108 44.5T100-625q0 39 15.5 76t53.888 84.067q38.388 47.068 104.5 110Q340-292 440-200q32-29 60.5-54t56.5-49l6.632 6.474L578-282.5l14.368 14.026L599-262q-27 24-56 49t-62 55l-41 37Zm290-159v-130H600v-60h130v-130h60v130h130v60H790v130h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-heart-plus\"></use></svg>"},"ng-help":{"symbol":"<symbol id=\"ng-help\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-help\"></use></svg>"},"ng-history-toggle-off":{"symbol":"<symbol id=\"ng-history-toggle-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M612-306 450-468v-202h60v178l144 144-42 42Zm-495-1q-15-34-24-70t-12-73h60q2 29 10 57.5t19 55.5l-53 30ZM81-510q3-38 12-74t25-70l52 30q-12 27-19.5 56t-9.5 58H81Zm173 363q-32-22-59.5-49T146-255l53-30q17 25 38.5 46.5T284-200l-30 53Zm-55-529-52-30q21-32 48-59t59-48l30 53q-25 17-46.5 38T199-676ZM450-81q-38-3-74-12t-70-25l30-52q27 12 56 19.5t58 9.5v60ZM336-790l-30-52q34-16 70-25t74-12v60q-29 2-58 9.5T336-790ZM510-81v-60q29-2 58-9.5t56-19.5l30 52q-34 16-70 25t-74 12Zm114-709q-27-12-56-19.5t-58-9.5v-60q38 3 74 11.5t70 25.5l-30 52Zm82 643-30-53q25-17 46-38t38-46l53 30q-21 32-48 59t-59 48Zm54-529q-17-25-38-46t-46-38l30-53q32 21 58.5 48t47.5 59l-52 30Zm59 166q-2-30-10-58.5T789-624l53-30q17 34 25.5 70t11.5 74h-60Zm23 204-52-30q12-27 19.5-56t9.5-58h60q-3 38-12 74t-25 70Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-history-toggle-off\"></use></svg>"},"ng-home":{"symbol":"<symbol id=\"ng-home\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-home\"></use></svg>"},"ng-indeterminate-check-box":{"symbol":"<symbol id=\"ng-indeterminate-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M250-452h461v-60H250v60Zm-70 332q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-indeterminate-check-box\"></use></svg>"},"ng-info":{"symbol":"<symbol id=\"ng-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M453-280h60v-240h-60v240Zm26.982-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-info\"></use></svg>"},"ng-install-mobile":{"symbol":"<symbol id=\"ng-install-mobile\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M260-40q-24 0-42-18t-18-42v-760q0-24 18-42t42-18h320v60H260v30h320v60H260v580h440v-130h60v220q0 24-18 42t-42 18H260Zm0-90v30h440v-30H260Zm474-284L548-600l42-42 114 113v-301h60v301l114-113 42 42-186 186ZM260-830v-30 30Zm0 700v30-30Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-install-mobile\"></use></svg>"},"ng-live-tv":{"symbol":"<symbol id=\"ng-live-tv\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m383-350 267-170-267-170v340Zm-53 230v-80H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H630v80H330ZM140-260h680v-520H140v520Zm0 0v-520 520Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-live-tv\"></use></svg>"},"ng-login":{"symbol":"<symbol id=\"ng-login\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M489-120v-60h291v-600H489v-60h291q24 0 42 18t18 42v600q0 24-18 42t-42 18H489Zm-78-185-43-43 102-102H120v-60h348L366-612l43-43 176 176-174 174Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-login\"></use></svg>"},"ng-logout":{"symbol":"<symbol id=\"ng-logout\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-logout\"></use></svg>"},"ng-menu-open":{"symbol":"<symbol id=\"ng-menu-open\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-240v-60h520v60H120Zm678-52L609-481l188-188 43 43-145 145 146 146-43 43ZM120-452v-60h400v60H120Zm0-208v-60h520v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-menu-open\"></use></svg>"},"ng-mic-off":{"symbol":"<symbol id=\"ng-mic-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m686-361-43-43q21-26 31-58.5t10-66.5h60q0 46-15 89t-43 79ZM461-586Zm97 97-53-52v-238q0-17.425-11.788-29.213Q481.425-820 464-820q-17.425 0-29.212 11.787Q423-796.425 423-779v155l-60-60v-95q0-42.083 29.441-71.542Q421.882-880 463.941-880t71.559 29.458Q565-821.083 565-779v250q0 8-1.5 20t-5.5 20ZM434-120v-136q-106-11-178-89t-72-184h60q0 91 64.5 153T464-314q38 0 73.11-12.337Q572.221-338.675 601-361l43 43q-31 26-69.014 41.568Q536.972-260.865 494-256v136h-60Zm397 65L36-850l38-38L869-93l-38 38Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mic-off\"></use></svg>"},"ng-mic":{"symbol":"<symbol id=\"ng-mic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mic\"></use></svg>"},"ng-mouse":{"symbol":"<symbol id=\"ng-mouse\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80q-118 0-199-81t-81-199v-260q0-118 81-199t199-81q118 0 199 81t81 199v260q0 118-81 199T480-80Zm30-540h190q0-81-53-144t-137-74v218Zm-250 0h190v-218q-84 11-137 74t-53 144Zm219.788 480Q571-140 635.5-204.35 700-268.7 700-360v-200H260v200q0 91.3 64.288 155.65Q388.576-140 479.788-140ZM480-560Zm30-60Zm-60 0Zm30 60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mouse\"></use></svg>"},"ng-movie-info":{"symbol":"<symbol id=\"ng-movie-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M140-120q-24 0-42-18t-18-42v-599q0-24 18-42.5t42-18.5h681q24.338 0 41.669 18.5Q880-803 880-779v599q0 24-17.331 42T821-120H140Zm0-60h105v-105H140v105Zm576 0h105v-105H716v105ZM450-294h60v-233h-60v233Zm-310-50h105v-105H140v105Zm576 0h105v-105H716v105ZM140-509h105v-105H140v105Zm576 0h105v-105H716v105ZM480.175-613q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5ZM140-674h105v-105H140v105Zm576 0h105v-105H716v105ZM305-180h352v-599H305v599Zm0-599h352-352Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-movie-info\"></use></svg>"},"ng-movie":{"symbol":"<symbol id=\"ng-movie\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m140-800 74 152h130l-74-152h89l74 152h130l-74-152h89l74 152h130l-74-152h112q24 0 42 18t18 42v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18Zm0 212v368h680v-368H140Zm0 0v368-368Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-movie\"></use></svg>"},"ng-no-sound":{"symbol":"<symbol id=\"ng-no-sound\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m611-323-43-43 114-113-114-113 43-43 113 114 113-114 43 43-114 113 114 113-43 43-113-114-113 114Zm-491-37v-240h160l200-200v640L280-360H120Zm300-288L307-540H180v120h127l113 109v-337ZM311-481Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-no-sound\"></use></svg>"},"ng-notifications-active":{"symbol":"<symbol id=\"ng-notifications-active\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M124-567q0-81 34-153.5T255-844l41 45q-53 43-82.5 103.5T184-567h-60Zm653 0q0-68-28-128.5T668-799l41-45q62 52 95 124t33 153h-60ZM160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications-active\"></use></svg>"},"ng-notifications-off":{"symbol":"<symbol id=\"ng-notifications-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M160-200v-60h84v-315q0-29.598 8.5-58.299T276-688l45 45q-8 17-12.5 33.5T304-575v315h316L75-805l42-42 726 727-42 42-122-122H160Zm557-132-60-60v-174q0-75-50.5-126.5T482-744q-35 0-67 11.5T356-693l-43-43q27-26 54.5-40.5T424-798v-26.091q0-23.295 16.265-39.602Q456.529-880 479.765-880 503-880 519.5-863.693t16.5 39.602V-798q78 17 129.5 82T717-566v234Zm-255-86Zm18 338q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm27-463Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications-off\"></use></svg>"},"ng-notifications":{"symbol":"<symbol id=\"ng-notifications\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications\"></use></svg>"},"ng-open-in-new":{"symbol":"<symbol id=\"ng-open-in-new\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h279v60H180v600h600v-279h60v279q0 24-18 42t-42 18H180Zm202-219-42-43 398-398H519v-60h321v321h-60v-218L382-339Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-open-in-new\"></use></svg>"},"ng-page-info":{"symbol":"<symbol id=\"ng-page-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M700-130q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733-190 756.5-213.265q23.5-23.264 23.5-56.5Q780-303 756.735-326.5q-23.264-23.5-56.5-23.5Q667-350 643.5-326.735q-23.5 23.264-23.5 56.5Q620-237 643.265-213.5q23.264 23.5 56.5 23.5ZM120-240v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293-610 316.5-633.265q23.5-23.264 23.5-56.5Q340-723 316.735-746.5q-23.264-23.5-56.5-23.5Q227-770 203.5-746.735q-23.5 23.264-23.5 56.5Q180-657 203.265-633.5q23.264 23.5 56.5 23.5ZM480-660v-60h360v60H480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-page-info\"></use></svg>"},"ng-password":{"symbol":"<symbol id=\"ng-password\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M80-200v-61h800v61H80Zm38-254-40-22 40-68H40v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 22-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-password\"></use></svg>"},"ng-pause-circle":{"symbol":"<symbol id=\"ng-pause-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-pause-circle\"></use></svg>"},"ng-pause":{"symbol":"<symbol id=\"ng-pause\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-pause\"></use></svg>"},"ng-play-arrow":{"symbol":"<symbol id=\"ng-play-arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M8 5v14l11-7z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-arrow\"></use></svg>"},"ng-play-circle":{"symbol":"<symbol id=\"ng-play-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-circle\"></use></svg>"},"ng-power-settings-new":{"symbol":"<symbol id=\"ng-power-settings-new\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M450-438v-406h60v406h-60Zm30 320q-74 0-139.5-28.5T226-224q-49-49-77.5-114.5T120-478q0-80 34-149.5T250-751l42 42q-53 43-82.5 102.5T180-478.022Q180-353 267.5-265.5 355-178 480-178q125.357 0 212.679-87.5Q780-353 780-478.022 780-547 750.5-607.5 721-668 670-709l43-42q60 51 93.5 122T840-478q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-118Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-power-settings-new\"></use></svg>"},"ng-radio-button-checked":{"symbol":"<symbol id=\"ng-radio-button-checked\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-radio-button-checked\"></use></svg>"},"ng-radio-button-unchecked":{"symbol":"<symbol id=\"ng-radio-button-unchecked\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-radio-button-unchecked\"></use></svg>"},"ng-refresh":{"symbol":"<symbol id=\"ng-refresh\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-160q-133 0-226.5-93.5T160-480q0-133 93.5-226.5T480-800q85 0 149 34.5T740-671v-129h60v254H546v-60h168q-38-60-97-97t-137-37q-109 0-184.5 75.5T220-480q0 109 75.5 184.5T480-220q83 0 152-47.5T728-393h62q-29 105-115 169t-195 64Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-refresh\"></use></svg>"},"ng-search":{"symbol":"<symbol id=\"ng-search\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-search\"></use></svg>"},"ng-select-check-box":{"symbol":"<symbol id=\"ng-select-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q14 0 25.5 6t18.5 14l-44 44v-4H180v600h600v-343l60-60v403q0 24.75-17.625 42.375T780-120H180Zm281-168L239-510l42-42 180 180 382-382 42 42-424 424Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-select-check-box\"></use></svg>"},"ng-settings":{"symbol":"<symbol id=\"ng-settings\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-settings\"></use></svg>"},"ng-shelf-position":{"symbol":"<symbol id=\"ng-shelf-position\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-121q-24 0-42-18t-18-42v-599q0-24 18-42t42-18h640q24 0 42 18t18 42v599q0 24-18 42t-42 18H180Zm0-201v141h640v-141H180Zm490-60h150v-398H670v398Zm-490 0h150v-398H180v398Zm210 0h220v-398H390v398Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-shelf-position\"></use></svg>"},"ng-skip-next":{"symbol":"<symbol id=\"ng-skip-next\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M680-240v-480h60v480h-60Zm-460 0v-480l346 240-346 240Zm60-240Zm0 125 181-125-181-125v250Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-skip-next\"></use></svg>"},"ng-skip-previous":{"symbol":"<symbol id=\"ng-skip-previous\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M220-240v-480h60v480h-60Zm520 0L394-480l346-240v480Zm-60-240Zm0 125v-250L499-480l181 125Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-skip-previous\"></use></svg>"},"ng-sort":{"symbol":"<symbol id=\"ng-sort\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-240v-60h240v60H120Zm0-210v-60h480v60H120Zm0-210v-60h720v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-sort\"></use></svg>"},"ng-star":{"symbol":"<symbol id=\"ng-star\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-star\"></use></svg>"},"ng-stop-circle":{"symbol":"<symbol id=\"ng-stop-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M330-330h300v-300H330v300ZM480.266-80q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-stop-circle\"></use></svg>"},"ng-stop":{"symbol":"<symbol id=\"ng-stop\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M6 6h12v12H6z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-stop\"></use></svg>"},"ng-thumb-down":{"symbol":"<symbol id=\"ng-thumb-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M242-840h444v512L408-40l-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43-477 41.5-484.5T43-499l126-290q8.878-21.25 29.595-36.125Q219.311-840 242-840Zm384 60H229L103-481v93h373l-53 249 203-214v-427Zm0 427v-427 427Zm60 25v-60h133v-392H686v-60h193v512H686Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-thumb-down\"></use></svg>"},"ng-thumb-up":{"symbol":"<symbol id=\"ng-thumb-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M716-120H272v-512l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915-461L789-171q-8.878 21.25-29.595 36.125Q738.689-120 716-120Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79v-512h193Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-thumb-up\"></use></svg>"},"ng-tips-and-updates":{"symbol":"<symbol id=\"ng-tips-and-updates\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m887-567-23-50-50-23 50-23 23-50 23 50 50 23-50 23-23 50ZM760-742l-35-74-74-35 74-35 35-74 35 74 74 35-74 35-35 74ZM360-80q-34 0-57.5-23.5T279-161h162q0 34-23.5 57.5T360-80ZM198-223v-60h324v60H198Zm5-121q-66-43-104.5-107.5T60-597q0-122 89-211t211-89q122 0 211 89t89 211q0 81-38 145.5T517-344H203Zm22-60h271q48-32 76-83t28-110q0-99-70.5-169.5T360-837q-99 0-169.5 70.5T120-597q0 59 28 110t77 83Zm135 0Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-tips-and-updates\"></use></svg>"},"ng-toggle-off":{"symbol":"<symbol id=\"ng-toggle-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm-1.059-79Q321-379 350.5-408.441t29.5-71.5Q380-522 350.559-551.5t-71.5-29.5Q237-581 207.5-551.559t-29.5 71.5Q178-438 207.441-408.5t71.5 29.5ZM480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toggle-off\"></use></svg>"},"ng-toggle-on":{"symbol":"<symbol id=\"ng-toggle-on\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm400.941-79Q723-379 752.5-408.441t29.5-71.5Q782-522 752.559-551.5t-71.5-29.5Q639-581 609.5-551.559t-29.5 71.5Q580-438 609.441-408.5t71.5 29.5ZM480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toggle-on\"></use></svg>"},"ng-toolbar":{"symbol":"<symbol id=\"ng-toolbar\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-513h600v-147H180v147Zm600 60H180v393h600v-393Zm-600-60v60-60Zm0 0v-147 147Zm0 60v393-393Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toolbar\"></use></svg>"},"ng-touchpad-mouse":{"symbol":"<symbol id=\"ng-touchpad-mouse\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M659.798-140Q726-140 773-186.857T820-300v-70H500v70q0 66.286 46.798 113.143t113 46.857ZM500-430h130v-147q-54 11-90 51.5T500-430Zm190 0h130q-4-55-40-95.5T690-577v147ZM660-80q-92 0-156-64t-64-156v-120q0-92 64-156t156-64q92 0 156 64t64 156v120q0 92-64 156T660-80ZM140-220v-520 520Zm0 60q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v146q-12.825-16.72-27.912-30.36Q837-638 820-650v-90H140v520h251q5 15.836 11.5 30.918Q409-174 417-160H140Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-touchpad-mouse\"></use></svg>"},"ng-tune":{"symbol":"<symbol id=\"ng-tune\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M427-120v-225h60v83h353v60H487v82h-60Zm-307-82v-60h247v60H120Zm187-166v-82H120v-60h187v-84h60v226h-60Zm120-82v-60h413v60H427Zm166-165v-225h60v82h187v60H653v83h-60Zm-473-83v-60h413v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-tune\"></use></svg>"},"ng-volume-down":{"symbol":"<symbol id=\"ng-volume-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-down\"></use></svg>"},"ng-volume-mute":{"symbol":"<symbol id=\"ng-volume-mute\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M7 9v6h4l5 5V4l-5 5H7z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-mute\"></use></svg>"},"ng-volume-off":{"symbol":"<symbol id=\"ng-volume-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-off\"></use></svg>"},"ng-volume-up":{"symbol":"<symbol id=\"ng-volume-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-up\"></use></svg>"},"ng-width-full":{"symbol":"<symbol id=\"ng-width-full\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M140-160q-24.75 0-42.375-17.625T80-220v-520q0-24.75 17.625-42.375T140-800h680q24.75 0 42.375 17.625T880-740v520q0 24.75-17.625 42.375T820-160H140Zm0-60h70v-520h-70v520Zm130 0h420v-520H270v520Zm480 0h70v-520h-70v520ZM270-740v520-520Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-width-full\"></use></svg>"}};
// inject the root element once
let init = sprite.parentElement !== null;

// generate xlink that can be used on the fly
function generateSVG(code, size, color)
{
    parser.innerHTML = code;
    const elem = parser.removeChild(parser.firstChild);
    if(size){
        elem.setAttribute('width', '' + size);
        elem.setAttribute('height', '' + size);
    }
    if(color) {
        elem.setAttribute('fill', color);
    }
    return elem;
}


function isElement(elem)
{
    return !!(elem instanceof Object && elem.querySelector);
}

function loadSprite(id)
{
    if (id && icons[id] && icons[id].symbol)
    {

        if (!init)
        {
            // inject shadowroot
            document.documentElement.appendChild(sprite);
        }

        if(!sprite.querySelector('#' + id)){
            // inject symbol
            sprite.innerHTML += icons[id].symbol;
        }

        delete icons[id].symbol;
    }
}



// Easy to inject icon class
class Xlink
{

    get id()
    {
        return this._id;
    }

    get template()
    {
        return icons[this.id].xlink;
    }


    appendTo(parent, size, color)
    {
        if (isElement(parent))
        {
            parent.appendChild(this.generate(size, color));
        }
    }
    prependTo(parent, size, color)
    {
        if (isElement(parent))
        {
            parent.insertBefore(this.generate(size, color), parent.firstElementChild);
        }
    }
    insertBefore(sibling, size, color)
    {
        if (isElement(sibling))
        {
            sibling.parentElement?.insertBefore(this.generate(size, color), sibling);
        }
    }

    generate(size, color)
    {
        loadSprite(this.id);
        return generateSVG(this.template, size, color);
    }

    constructor(id)
    {
        this._id = id;
    }

}

//render sprite (for ssr)
export function render(){
    return sprite.outerHTML;
}



export function loadAll(){
    for(let id of Object.keys(icons)){
        loadSprite(id);
    }
}


// generate xlinks
export const ng_app_shortcut = new Xlink('ng-app-shortcut');
export const ng_arrow_drop_down = new Xlink('ng-arrow-drop-down');
export const ng_arrow_selector_tool = new Xlink('ng-arrow-selector-tool');
export const ng_backspace = new Xlink('ng-backspace');
export const ng_bookmark_add = new Xlink('ng-bookmark-add');
export const ng_bookmark_added = new Xlink('ng-bookmark-added');
export const ng_bookmark_remove = new Xlink('ng-bookmark-remove');
export const ng_bookmark = new Xlink('ng-bookmark');
export const ng_bookmarks = new Xlink('ng-bookmarks');
export const ng_cancel = new Xlink('ng-cancel');
export const ng_check_box_outline_blank = new Xlink('ng-check-box-outline-blank');
export const ng_check_box = new Xlink('ng-check-box');
export const ng_check_circle = new Xlink('ng-check-circle');
export const ng_chevron_left = new Xlink('ng-chevron-left');
export const ng_chevron_right = new Xlink('ng-chevron-right');
export const ng_close = new Xlink('ng-close');
export const ng_disabled_by_default = new Xlink('ng-disabled-by-default');
export const ng_dock_to_bottom = new Xlink('ng-dock-to-bottom');
export const ng_dock_to_left = new Xlink('ng-dock-to-left');
export const ng_dock_to_right = new Xlink('ng-dock-to-right');
export const ng_done = new Xlink('ng-done');
export const ng_drag_pan = new Xlink('ng-drag-pan');
export const ng_expand_circle_down = new Xlink('ng-expand-circle-down');
export const ng_expand_circle_up = new Xlink('ng-expand-circle-up');
export const ng_expand_less = new Xlink('ng-expand-less');
export const ng_expand_more = new Xlink('ng-expand-more');
export const ng_fast_forward = new Xlink('ng-fast-forward');
export const ng_fast_rewind = new Xlink('ng-fast-rewind');
export const ng_favorite_full = new Xlink('ng-favorite-full');
export const ng_favorite = new Xlink('ng-favorite');
export const ng_filter_list = new Xlink('ng-filter-list');
export const ng_fingerprint = new Xlink('ng-fingerprint');
export const ng_fullscreen_exit = new Xlink('ng-fullscreen-exit');
export const ng_fullscreen = new Xlink('ng-fullscreen');
export const ng_heart_minus = new Xlink('ng-heart-minus');
export const ng_heart_plus = new Xlink('ng-heart-plus');
export const ng_help = new Xlink('ng-help');
export const ng_history_toggle_off = new Xlink('ng-history-toggle-off');
export const ng_home = new Xlink('ng-home');
export const ng_indeterminate_check_box = new Xlink('ng-indeterminate-check-box');
export const ng_info = new Xlink('ng-info');
export const ng_install_mobile = new Xlink('ng-install-mobile');
export const ng_live_tv = new Xlink('ng-live-tv');
export const ng_login = new Xlink('ng-login');
export const ng_logout = new Xlink('ng-logout');
export const ng_menu_open = new Xlink('ng-menu-open');
export const ng_mic_off = new Xlink('ng-mic-off');
export const ng_mic = new Xlink('ng-mic');
export const ng_mouse = new Xlink('ng-mouse');
export const ng_movie_info = new Xlink('ng-movie-info');
export const ng_movie = new Xlink('ng-movie');
export const ng_no_sound = new Xlink('ng-no-sound');
export const ng_notifications_active = new Xlink('ng-notifications-active');
export const ng_notifications_off = new Xlink('ng-notifications-off');
export const ng_notifications = new Xlink('ng-notifications');
export const ng_open_in_new = new Xlink('ng-open-in-new');
export const ng_page_info = new Xlink('ng-page-info');
export const ng_password = new Xlink('ng-password');
export const ng_pause_circle = new Xlink('ng-pause-circle');
export const ng_pause = new Xlink('ng-pause');
export const ng_play_arrow = new Xlink('ng-play-arrow');
export const ng_play_circle = new Xlink('ng-play-circle');
export const ng_power_settings_new = new Xlink('ng-power-settings-new');
export const ng_radio_button_checked = new Xlink('ng-radio-button-checked');
export const ng_radio_button_unchecked = new Xlink('ng-radio-button-unchecked');
export const ng_refresh = new Xlink('ng-refresh');
export const ng_search = new Xlink('ng-search');
export const ng_select_check_box = new Xlink('ng-select-check-box');
export const ng_settings = new Xlink('ng-settings');
export const ng_shelf_position = new Xlink('ng-shelf-position');
export const ng_skip_next = new Xlink('ng-skip-next');
export const ng_skip_previous = new Xlink('ng-skip-previous');
export const ng_sort = new Xlink('ng-sort');
export const ng_star = new Xlink('ng-star');
export const ng_stop_circle = new Xlink('ng-stop-circle');
export const ng_stop = new Xlink('ng-stop');
export const ng_thumb_down = new Xlink('ng-thumb-down');
export const ng_thumb_up = new Xlink('ng-thumb-up');
export const ng_tips_and_updates = new Xlink('ng-tips-and-updates');
export const ng_toggle_off = new Xlink('ng-toggle-off');
export const ng_toggle_on = new Xlink('ng-toggle-on');
export const ng_toolbar = new Xlink('ng-toolbar');
export const ng_touchpad_mouse = new Xlink('ng-touchpad-mouse');
export const ng_tune = new Xlink('ng-tune');
export const ng_volume_down = new Xlink('ng-volume-down');
export const ng_volume_mute = new Xlink('ng-volume-mute');
export const ng_volume_off = new Xlink('ng-volume-off');
export const ng_volume_up = new Xlink('ng-volume-up');
export const ng_width_full = new Xlink('ng-width-full');

// creates naming map
const names = [    ['ng-app-shortcut', 'ng_app_shortcut'],
    ['ng-arrow-drop-down', 'ng_arrow_drop_down'],
    ['ng-arrow-selector-tool', 'ng_arrow_selector_tool'],
    ['ng-backspace', 'ng_backspace'],
    ['ng-bookmark-add', 'ng_bookmark_add'],
    ['ng-bookmark-added', 'ng_bookmark_added'],
    ['ng-bookmark-remove', 'ng_bookmark_remove'],
    ['ng-bookmark', 'ng_bookmark'],
    ['ng-bookmarks', 'ng_bookmarks'],
    ['ng-cancel', 'ng_cancel'],
    ['ng-check-box-outline-blank', 'ng_check_box_outline_blank'],
    ['ng-check-box', 'ng_check_box'],
    ['ng-check-circle', 'ng_check_circle'],
    ['ng-chevron-left', 'ng_chevron_left'],
    ['ng-chevron-right', 'ng_chevron_right'],
    ['ng-close', 'ng_close'],
    ['ng-disabled-by-default', 'ng_disabled_by_default'],
    ['ng-dock-to-bottom', 'ng_dock_to_bottom'],
    ['ng-dock-to-left', 'ng_dock_to_left'],
    ['ng-dock-to-right', 'ng_dock_to_right'],
    ['ng-done', 'ng_done'],
    ['ng-drag-pan', 'ng_drag_pan'],
    ['ng-expand-circle-down', 'ng_expand_circle_down'],
    ['ng-expand-circle-up', 'ng_expand_circle_up'],
    ['ng-expand-less', 'ng_expand_less'],
    ['ng-expand-more', 'ng_expand_more'],
    ['ng-fast-forward', 'ng_fast_forward'],
    ['ng-fast-rewind', 'ng_fast_rewind'],
    ['ng-favorite-full', 'ng_favorite_full'],
    ['ng-favorite', 'ng_favorite'],
    ['ng-filter-list', 'ng_filter_list'],
    ['ng-fingerprint', 'ng_fingerprint'],
    ['ng-fullscreen-exit', 'ng_fullscreen_exit'],
    ['ng-fullscreen', 'ng_fullscreen'],
    ['ng-heart-minus', 'ng_heart_minus'],
    ['ng-heart-plus', 'ng_heart_plus'],
    ['ng-help', 'ng_help'],
    ['ng-history-toggle-off', 'ng_history_toggle_off'],
    ['ng-home', 'ng_home'],
    ['ng-indeterminate-check-box', 'ng_indeterminate_check_box'],
    ['ng-info', 'ng_info'],
    ['ng-install-mobile', 'ng_install_mobile'],
    ['ng-live-tv', 'ng_live_tv'],
    ['ng-login', 'ng_login'],
    ['ng-logout', 'ng_logout'],
    ['ng-menu-open', 'ng_menu_open'],
    ['ng-mic-off', 'ng_mic_off'],
    ['ng-mic', 'ng_mic'],
    ['ng-mouse', 'ng_mouse'],
    ['ng-movie-info', 'ng_movie_info'],
    ['ng-movie', 'ng_movie'],
    ['ng-no-sound', 'ng_no_sound'],
    ['ng-notifications-active', 'ng_notifications_active'],
    ['ng-notifications-off', 'ng_notifications_off'],
    ['ng-notifications', 'ng_notifications'],
    ['ng-open-in-new', 'ng_open_in_new'],
    ['ng-page-info', 'ng_page_info'],
    ['ng-password', 'ng_password'],
    ['ng-pause-circle', 'ng_pause_circle'],
    ['ng-pause', 'ng_pause'],
    ['ng-play-arrow', 'ng_play_arrow'],
    ['ng-play-circle', 'ng_play_circle'],
    ['ng-power-settings-new', 'ng_power_settings_new'],
    ['ng-radio-button-checked', 'ng_radio_button_checked'],
    ['ng-radio-button-unchecked', 'ng_radio_button_unchecked'],
    ['ng-refresh', 'ng_refresh'],
    ['ng-search', 'ng_search'],
    ['ng-select-check-box', 'ng_select_check_box'],
    ['ng-settings', 'ng_settings'],
    ['ng-shelf-position', 'ng_shelf_position'],
    ['ng-skip-next', 'ng_skip_next'],
    ['ng-skip-previous', 'ng_skip_previous'],
    ['ng-sort', 'ng_sort'],
    ['ng-star', 'ng_star'],
    ['ng-stop-circle', 'ng_stop_circle'],
    ['ng-stop', 'ng_stop'],
    ['ng-thumb-down', 'ng_thumb_down'],
    ['ng-thumb-up', 'ng_thumb_up'],
    ['ng-tips-and-updates', 'ng_tips_and_updates'],
    ['ng-toggle-off', 'ng_toggle_off'],
    ['ng-toggle-on', 'ng_toggle_on'],
    ['ng-toolbar', 'ng_toolbar'],
    ['ng-touchpad-mouse', 'ng_touchpad_mouse'],
    ['ng-tune', 'ng_tune'],
    ['ng-volume-down', 'ng_volume_down'],
    ['ng-volume-mute', 'ng_volume_mute'],
    ['ng-volume-off', 'ng_volume_off'],
    ['ng-volume-up', 'ng_volume_up'],
    ['ng-width-full', 'ng_width_full'],
];

// generate default export
export const svgs = {
    ng_app_shortcut,
    ng_arrow_drop_down,
    ng_arrow_selector_tool,
    ng_backspace,
    ng_bookmark_add,
    ng_bookmark_added,
    ng_bookmark_remove,
    ng_bookmark,
    ng_bookmarks,
    ng_cancel,
    ng_check_box_outline_blank,
    ng_check_box,
    ng_check_circle,
    ng_chevron_left,
    ng_chevron_right,
    ng_close,
    ng_disabled_by_default,
    ng_dock_to_bottom,
    ng_dock_to_left,
    ng_dock_to_right,
    ng_done,
    ng_drag_pan,
    ng_expand_circle_down,
    ng_expand_circle_up,
    ng_expand_less,
    ng_expand_more,
    ng_fast_forward,
    ng_fast_rewind,
    ng_favorite_full,
    ng_favorite,
    ng_filter_list,
    ng_fingerprint,
    ng_fullscreen_exit,
    ng_fullscreen,
    ng_heart_minus,
    ng_heart_plus,
    ng_help,
    ng_history_toggle_off,
    ng_home,
    ng_indeterminate_check_box,
    ng_info,
    ng_install_mobile,
    ng_live_tv,
    ng_login,
    ng_logout,
    ng_menu_open,
    ng_mic_off,
    ng_mic,
    ng_mouse,
    ng_movie_info,
    ng_movie,
    ng_no_sound,
    ng_notifications_active,
    ng_notifications_off,
    ng_notifications,
    ng_open_in_new,
    ng_page_info,
    ng_password,
    ng_pause_circle,
    ng_pause,
    ng_play_arrow,
    ng_play_circle,
    ng_power_settings_new,
    ng_radio_button_checked,
    ng_radio_button_unchecked,
    ng_refresh,
    ng_search,
    ng_select_check_box,
    ng_settings,
    ng_shelf_position,
    ng_skip_next,
    ng_skip_previous,
    ng_sort,
    ng_star,
    ng_stop_circle,
    ng_stop,
    ng_thumb_down,
    ng_thumb_up,
    ng_tips_and_updates,
    ng_toggle_off,
    ng_toggle_on,
    ng_toolbar,
    ng_touchpad_mouse,
    ng_tune,
    ng_volume_down,
    ng_volume_mute,
    ng_volume_off,
    ng_volume_up,
    ng_width_full,
};
export default svgs;

//watch dom for icons to add
const
    selector = 'i[class^="ng-"]',
    nodes = new Set(),
    watcher = (elem) =>
    {
        return () =>
        {
            for (let target of [...elem.querySelectorAll(selector)])
            {

                if (nodes.has(target))
                {
                    continue;
                }
                nodes.add(target);

                // creates the icon and remove the node
                const
                    id = target.className.split(' ')[0],
                    [, name] = names.find(item => item[0] === id) ?? ['', ''];


                if (name && svgs[name])
                {
                    let size = target.getAttribute("size"), color = target.getAttribute("color");

                    svgs[name].insertBefore(target, size, color);
                }

                target.parentElement?.removeChild(target);
            }
        };
    };






export function watch(elem)
{
    elem ??= document.body;
    const
        fn = watcher(elem),
        observer = new MutationObserver(fn);

    fn();
    observer.observe(elem, {
        attributes: true, childList: true, subtree: true
    });
    return () =>
    {
        observer.disconnect();
    };
}


export const unwatch = watch();

