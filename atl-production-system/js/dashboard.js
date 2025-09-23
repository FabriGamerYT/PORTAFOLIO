
        // Current Date and Time
        function updateDateTime() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
            
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            document.getElementById('current-time').textContent = now.toLocaleTimeString('es-ES', timeOptions);
        }
        
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // User Menu Toggle
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');
        
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
                userMenu.classList.add('hidden');
            }
        });

        // Mobile sidebar toggle
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const closeSidebarButton = document.getElementById('close-sidebar');
        
        mobileMenuButton.addEventListener('click', () => {
            mobileSidebar.classList.toggle('-translate-x-full');
        });
        
        closeSidebarButton.addEventListener('click', () => {
            mobileSidebar.classList.add('-translate-x-full');
        });

        // Production Chart
        const ctx = document.getElementById('productionChart').getContext('2d');
        const productionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [
                    {
                        label: 'Unidades Producidas',
                        data: [1150, 1220, 1280, 1190, 1284, 1100, 950],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)'
                    },
                    {
                        label: 'Meta',
                        data: [1200, 1200, 1200, 1200, 1200, 1000, 900],
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(107, 114, 128, 0.5)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0,
                        pointBackgroundColor: 'rgba(107, 114, 128, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 6
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 800,
                        ticks: {
                            stepSize: 100
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        // segundo scripti dashboard
        (function(){
            function c(){
                var b=a.contentDocument||a.contentWindow.document;
                if(b){
                    var d=b.createElement('script');
                    d.innerHTML="window.__CF$cv$params={r:'96134583d7694576',t:'MTc1Mjg1NTI2MC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
                    b.getElementsByTagName('head')[0].appendChild(d)
                }
            }
            if(document.body){
                var a=document.createElement('iframe');
                a.height=1;
                a.width=1;
                a.style.position='absolute';
                a.style.top=0;
                a.style.left=0;
                a.style.border='none';
                a.style.visibility='hidden';
                document.body.appendChild(a);
                if('loading'!==document.readyState)c();
                else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
                else{
                    var e=document.onreadystatechange||function(){};
                    document.onreadystatechange=function(b){
                        e(b);
                        'loading'!==document.readyState&&(document.onreadystatechange=e,c())
                    }
                }
            }
        })();
        //tercer escripti dashboard