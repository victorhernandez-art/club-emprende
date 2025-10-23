document.addEventListener('DOMContentLoaded', () => {
    
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = navMenu.querySelectorAll('a');

    // 1. Lógica del Menú Hamburguesa
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('nav-open');
        hamburger.classList.toggle('nav-open');
    });

    // Cerrar menú al hacer clic en un enlace (en móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                navMenu.classList.remove('nav-open');
                hamburger.classList.remove('nav-open');
            }
        });
    });


    // 2. Animaciones al hacer Scroll (Intersection Observer)
    const revealItems = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '50px', // Activar 50px antes de que sea visible
        threshold: 0.1 // Al menos el 10% del elemento debe ser visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El elemento es visible, añadir la clase 'visible'
                entry.target.classList.add('visible');
            } else {
                // Opcional: si quieres que la animación se repita al salir y volver a entrar
                entry.target.classList.remove('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });
    
    
    // 3. Resaltar enlace de la página activa
    const currentPage = window.location.pathname.split('/').pop();
    const allNavLinks = document.querySelectorAll('.nav-menu a');

    allNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });


    // 7. Scroll effect for hero image (Re-triggering animation)
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const heroObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Se activa con el 10% de visibilidad
        };

        const heroObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        };

        const heroObserver = new IntersectionObserver(heroObserverCallback, heroObserverOptions);
        heroObserver.observe(heroImage);
    }

    // 4. Efecto Parallax en el Hero
    const heroSection = document.getElementById('inicio');
    if (heroSection) { // Check if heroSection exists
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Mueve el fondo más lento que el scroll para crear profundidad
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }

    // 5. Modal innovador para competencias (abre solo con click/teclado)
    const modalOverlay = document.getElementById('modalCompetencia');
    const modalClose = document.getElementById('modalClose');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const cardDetails = {
        '¡Necesito Emprender!': {
            icon: '⚡',
            body: 'Los emprendedores que participen de este proceso de formación y desarrollo de competencias serán capaces de actuar con más efectividad en su actividad diaria, mejorando el desempeño de su negocio.'
        },
        'Genero mi idea de emprendimiento': {
            icon: '💡',
            body: 'Aplica técnicas de ideación, define el problema y valida el encaje problema-solución con entrevistas rápidas.'
        },
        'Protejo mi idea de emprendimiento': {
            icon: '🛡️',
            body: 'Conoce NDA, registro de marca, derechos de autor y acuerdos entre socios para resguardar tu propuesta.'
        },
        'Ejecuto mi emprendimiento': {
            icon: '🚀',
            body: 'Construye un MVP, mide con KPIs y ajusta con aprendizaje validado. Prepara una landing y pruebas de mercado.'
        },
        'Puesta en marcha y mejoro mi empresa': {
            icon: '📈',
            body: 'Formaliza tu operación, estructura finanzas, marketing de crecimiento y un roadmap para escalar.'
        }
    };

    function openModalForCard(card) {
        if (!modalOverlay) return;
        const title = card.querySelector('h4')?.textContent?.trim() || '';
        const subtitle = card.getAttribute('data-subtitle') || '';
        const img = card.getAttribute('data-img');
        const details = cardDetails[title];
        modalIcon.textContent = details?.icon || '💡';
        modalTitle.textContent = title;
        const bodyText = card.getAttribute('data-body') || details?.body || '';
        const imgHTML = img ? `<img src="${img}" alt="${title}" />` : '';
        const subHTML = subtitle ? `<p style="color: var(--color-gray-medium); margin-bottom:1rem; font-style: italic; font-size: 1.1rem;">${subtitle}</p>` : '';
        modalBody.innerHTML = `${imgHTML}${subHTML}<div style="margin-top: 2rem;"><p>${bodyText}</p></div>`;

        // Mostrar el modal con efecto slide out
        modalOverlay.style.display = 'block';
        // Pequeño delay para asegurar que el display se aplique antes de la animación
        setTimeout(() => {
            modalOverlay.classList.add('open');
            document.body.classList.add('modal-open');
            modalClose?.focus();
        }, 10);
    }

    function closeModal() {
        if (!modalOverlay) return;
        // Remover la clase open para activar la animación de salida
        modalOverlay.classList.remove('open');
        document.body.classList.remove('modal-open');
        
        // Esperar a que termine la animación antes de ocultar completamente
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 500); // Coincide con la duración de la transición CSS (0.5s)
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Delegación de eventos en tarjetas de competencias
    const competenciaCards = document.querySelectorAll('.competencia-card');
    if (competenciaCards?.length) {
        competenciaCards.forEach((card) => {
            // Accesible por click/teclado
            card.addEventListener('click', () => openModalForCard(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModalForCard(card);
                }
            });
        });
        // Esc key para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // 6. Video modal inline (Conecta y Encuentra)
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoEmbed = document.getElementById('videoEmbed');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoCards = document.querySelectorAll('.video-card[data-yt]');

    function openVideoModal(youtubeId, title) {
        if (!videoModal || !videoEmbed) return;
        // Embed responsivo
        videoEmbed.innerHTML = `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,0.12)">
                <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" title="${title || ''}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
            </div>`;
        if (videoModalTitle) videoModalTitle.textContent = title || 'Reproduciendo…';
        videoModal.classList.add('open');
        document.body.classList.add('modal-open');
    }

    function closeVideoModal() {
        if (!videoModal || !videoEmbed) return;
        const dialog = videoModal.querySelector('.modal');
        if (dialog) { dialog.style.animation = 'modalPopOut .35s ease both'; }
        videoModal.style.animation = 'modalFadeOut .35s ease both';
        setTimeout(() => {
            // Detener reproducción
            videoEmbed.innerHTML = '';
            videoModal.classList.remove('open');
            videoModal.removeAttribute('style');
            if (dialog) dialog.removeAttribute('style');
            document.body.classList.remove('modal-open');
        }, 330);
    }

    if (videoCards?.length) {
        videoCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                openVideoModal(card.getAttribute('data-yt'), card.getAttribute('data-title'));
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openVideoModal(card.getAttribute('data-yt'), card.getAttribute('data-title'));
                }
            });
        });
        videoModalClose?.addEventListener('click', closeVideoModal);
        videoModal?.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && videoModal?.classList.contains('open')) closeVideoModal(); });
    }

    // 7. Noticias - carrusel + modal de nota completa
    const newsTrack = document.getElementById('newsTrack');
    const newsPrev = document.getElementById('newsPrev');
    const newsNext = document.getElementById('newsNext');
    const newsCards = document.querySelectorAll('.news-card[data-news]');
    const newsModal = document.getElementById('newsModal');
    const newsModalClose = document.getElementById('newsModalClose');
    const newsModalTitle = document.getElementById('newsModalTitle');
    const newsDate = document.getElementById('newsDate');
    const newsBodyText = document.getElementById('newsBodyText');
    const newsCoverImg = document.getElementById('newsCoverImg');
    const newsGallery = document.getElementById('newsGallery');

    let currentNewsIndex = 0;
    
    function scrollNews(direction) {
        if (!newsTrack) return;
        const cardsPerView = 3; // Mostrar 3 tarjetas a la vez
        const maxIndex = Math.max(0, newsCards.length - cardsPerView);
        
        currentNewsIndex = Math.max(0, Math.min(maxIndex, currentNewsIndex + direction));
        
        const cardWidth = newsTrack.querySelector('article')?.getBoundingClientRect().width || 320;
        const gap = 24; // gap entre tarjetas
        const translateX = currentNewsIndex * (cardWidth + gap);
        
        newsTrack.style.transform = `translateX(-${translateX}px)`;
        
        // Actualizar estado de los botones
        if (newsPrev) {
            newsPrev.style.opacity = currentNewsIndex === 0 ? '0.5' : '1';
            newsPrev.style.pointerEvents = currentNewsIndex === 0 ? 'none' : 'auto';
        }
        if (newsNext) {
            newsNext.style.opacity = currentNewsIndex >= maxIndex ? '0.5' : '1';
            newsNext.style.pointerEvents = currentNewsIndex >= maxIndex ? 'none' : 'auto';
        }
    }

    let currentGalleryIndex = 0;
    let galleryImages = [];

    function openNewsModal(dataJson) {
        if (!newsModal) return;
        
        try {
            const data = JSON.parse(dataJson);
            
            if (newsModalTitle) newsModalTitle.textContent = data.title || '';
            if (newsDate) newsDate.textContent = data.date || '';
            if (newsBodyText) newsBodyText.textContent = data.body || '';
            
            // Configurar galería
            galleryImages = data.gallery || [];
            currentGalleryIndex = 0;
            
            // Limpiar galería anterior
            if (newsGallery) {
                newsGallery.innerHTML = '';
                
                // Crear imágenes de la galería
                galleryImages.forEach((src, index) => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `${data.title || ''} - Foto ${index + 1}`;
                    if (index === 0) {
                        img.classList.add('active');
                    }
                    newsGallery.appendChild(img);
                });
            }
            
            // Actualizar contador y botones
            updateGalleryControls();
            
            newsModal.classList.add('open');
            document.body.classList.add('modal-open');
        } catch (error) {
            console.error('Error al abrir modal:', error);
        }
    }

    function updateGalleryControls() {
        const counter = document.getElementById('galleryCounter');
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        
        if (counter) {
            counter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
        }
        
        if (prevBtn) {
            prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentGalleryIndex === 0 ? 'none' : 'auto';
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = currentGalleryIndex >= galleryImages.length - 1 ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentGalleryIndex >= galleryImages.length - 1 ? 'none' : 'auto';
        }
    }

    function showGalleryImage(index) {
        const images = newsGallery.querySelectorAll('img');
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        currentGalleryIndex = index;
        updateGalleryControls();
    }

    function nextGalleryImage() {
        if (currentGalleryIndex < galleryImages.length - 1) {
            showGalleryImage(currentGalleryIndex + 1);
        }
    }

    function prevGalleryImage() {
        if (currentGalleryIndex > 0) {
            showGalleryImage(currentGalleryIndex - 1);
        }
    }

    function closeNewsModal() {
        if (!newsModal) return;
        const dialog = newsModal.querySelector('.modal');
        if (dialog) { dialog.style.animation = 'modalPopOut .35s ease both'; }
        newsModal.style.animation = 'modalFadeOut .35s ease both';
        setTimeout(() => {
            newsModal.classList.remove('open');
            newsModal.removeAttribute('style');
            if (dialog) dialog.removeAttribute('style');
            document.body.classList.remove('modal-open');
        }, 330);
    }

    if (newsTrack) {
        newsPrev?.addEventListener('click', () => scrollNews(-1));
        newsNext?.addEventListener('click', () => scrollNews(1));
        
        // Inicializar estado de los botones
        setTimeout(() => {
            if (newsPrev) {
                newsPrev.style.opacity = '0.5';
                newsPrev.style.pointerEvents = 'none';
            }
            if (newsNext && newsCards.length <= 3) {
                newsNext.style.opacity = '0.5';
                newsNext.style.pointerEvents = 'none';
            }
        }, 100);
    }
    if (newsCards?.length) {
        newsCards.forEach((card) => {
            // Event listener de click más robusto
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dataNews = card.getAttribute('data-news');
                
                if (dataNews) {
                    openNewsModal(dataNews);
                }
            }, true); // Usar capture para asegurar que se ejecute
            
            card.addEventListener('keydown', (e) => { 
                if (e.key === 'Enter' || e.key === ' ') { 
                    e.preventDefault(); 
                    const dataNews = card.getAttribute('data-news');
                    if (dataNews) {
                        openNewsModal(dataNews);
                    }
                } 
            });
        });
        newsModalClose?.addEventListener('click', closeNewsModal);
        newsModal?.addEventListener('click', (e) => { if (e.target === newsModal) closeNewsModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && newsModal?.classList.contains('open')) closeNewsModal(); });
        
        // Event listeners para la galería
        document.getElementById('galleryPrev')?.addEventListener('click', prevGalleryImage);
        document.getElementById('galleryNext')?.addEventListener('click', nextGalleryImage);
        
        // Navegación con teclado en la galería
        document.addEventListener('keydown', (e) => {
            if (newsModal?.classList.contains('open')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevGalleryImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextGalleryImage();
                }
            }
        });
    }

    // 8. Funcionalidad del Acordeón para Sedes Afiliadas
    const acordeonHeaders = document.querySelectorAll('.acordeon-header');
    
    acordeonHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Cerrar todos los acordeones
            acordeonHeaders.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
            });
            
            // Si el acordeón clickeado estaba cerrado, abrirlo
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Soporte para teclado (Enter y Espacio)
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

});
