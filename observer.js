document.addEventListener('DOMContentLoaded', function() {
    // Load headlines from the text file
    fetch('https://raw.githubusercontent.com/nedoramoteris/arcaneobserver/main/the%20arcane%20observer.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const headlinesContainer = document.getElementById('headlines-container');
            const lines = data.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
                headlinesContainer.innerHTML = '<p>No headlines found in the data file.</p>';
                return;
            }

            lines.forEach(line => {
                // Split by pipe character and trim each column
                const columns = line.split('|').map(col => col.trim());
                
                if (columns.length >= 3) {
                    const pageNumber = columns[0];
                    const headline = columns[1];
                    const description = columns[2];
                    
                    const headlineItem = document.createElement('div');
                    headlineItem.className = 'headline-item';
                    
                    headlineItem.innerHTML = `
                        <div class="headline-meta">
                            <span class="page-number">${pageNumber} psl.</span>
                        </div>
                        <h3>${headline}</h3>
                        <p>${description}</p>
                    `;
                    
                    headlinesContainer.appendChild(headlineItem);
                } else {
                    console.warn('Skipping malformed line:', line);
                }
            });
        })
        .catch(error => {
            console.error('Error loading headlines:', error);
            document.getElementById('headlines-container').innerHTML = 
                '<p>Error loading headlines. Please try again later.</p>';
        });

    // PDF download functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const element = document.getElementById('content-to-print');
            const opt = {
                margin: 10,
                filename: 'The_Arcane_Observer.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    backgroundColor: '#0a0a0a',
                    useCORS: true 
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            downloadBtn.style.display = 'none';
            
            html2pdf().from(element).set(opt).save().then(() => {
                downloadBtn.style.display = 'block';
            });
        });
    }

    // Subscription modal functionality
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const modal = document.getElementById('subscribe-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (subscribeBtns && modal && closeModal) {
        subscribeBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'flex';
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Form submission
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const plan = document.getElementById('plan').value;
            const payment = document.getElementById('payment').value;
            
            console.log('Subscription submitted:', { name, email, plan, payment });
            alert('Thank you for subscribing to The Arcane Observer! A confirmation has been sent to your email.');
            
            if (modal) modal.style.display = 'none';
            subscribeForm.reset();
        });
    }
});