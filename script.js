
    // DOM Elements
    const imageUpload = document.getElementById('imageUpload');
    const uploadContainer = document.getElementById('uploadContainer');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContent = document.getElementById('resultContent');
    const originalResultImage = document.getElementById('originalResultImage');
    const processedResultImage = document.getElementById('processedResultImage');

    // Metadata elements
    const filenameElement = document.getElementById('filename');
    const imageTypeElement = document.getElementById('imageType');
    const imageDimensionsElement = document.getElementById('imageDimensions');
    const imageSizeElement = document.getElementById('imageSize');

    // Diagnostic elements
    const diagnosisIndicator = document.getElementById('diagnosisIndicator');
    const diagnosisText = document.getElementById('diagnosisText');
    const diagnosisConfidence = document.getElementById('diagnosisConfidence');
    const cdrValue = document.getElementById('cdrValue');
    const rimValue = document.getElementById('rimValue');
    const rnflValue = document.getElementById('rnflValue');
    const onhValue = document.getElementById('onhValue');
    const recommendation1 = document.getElementById('recommendation1');
    const recommendation2 = document.getElementById('recommendation2');

    // Action buttons
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Handle image upload
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';

                filenameElement.textContent = file.name;
                imageTypeElement.textContent = file.type;
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                imageSizeElement.textContent = fileSize + ' MB';

                const img = new Image();
                img.onload = function() {
                    imageDimensionsElement.textContent = this.width + ' × ' + this.height + ' px';
                };
                img.src = e.target.result;

                analyzeBtn.disabled = false;
            };

            reader.readAsDataURL(file);
        }
    });

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadContainer.style.borderColor = '#0069b4';
        uploadContainer.style.backgroundColor = '#f8faff';
    }

    function unhighlight() {
        uploadContainer.style.borderColor = '#ccd7e6';
        uploadContainer.style.backgroundColor = '';
    }

    uploadContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            imageUpload.files = files;
            const event = new Event('change');
            imageUpload.dispatchEvent(event);
        }
    }

    // Handle analyze button click
    analyzeBtn.addEventListener('click', function() {
        resultPlaceholder.style.display = 'none';
        loadingIndicator.style.display = 'block';
        resultContent.style.display = 'none';

        setTimeout(function() {
            loadingIndicator.style.display = 'none';
            resultContent.style.display = 'block';

            originalResultImage.src = imagePreview.src;
            processedResultImage.src = imagePreview.src; // Placeholder; replace with actual processed image

            simulateGlaucomaAnalysis();
        }, 3000);
    });

    // Simulate glaucoma analysis
    function simulateGlaucomaAnalysis() {
        const cdr = (Math.random() * 0.3 + 0.4).toFixed(2); // CDR between 0.4 and 0.7
        const confidence = Math.floor(Math.random() * 20 + 80); // Confidence between 80% and 99%

        cdrValue.textContent = cdr;
        if (cdr > 0.5) {
            cdrValue.classList.add('high-value');
        } else {
            cdrValue.classList.remove('high-value');
        }

        const rimAssessments = ['Normal', 'Thinning observed', 'Significant thinning'];
        const rnflAssessments = ['Within normal limits', 'Borderline thinning', 'Abnormal thinning'];
        const onhAssessments = ['Normal appearance', 'Suspicious appearance', 'Abnormal appearance'];

        let rimIndex, rnflIndex, onhIndex;

        if (cdr < 0.5) {
            rimIndex = 0;
            rnflIndex = 0;
            onhIndex = 0;
        } else if (cdr < 0.6) {
            rimIndex = Math.random() > 0.5 ? 0 : 1;
            rnflIndex = Math.random() > 0.5 ? 0 : 1;
            onhIndex = Math.random() > 0.5 ? 0 : 1;
        } else {
            rimIndex = Math.random() > 0.3 ? 1 : 2;
            rnflIndex = Math.random() > 0.3 ? 1 : 2;
            onhIndex = Math.random() > 0.3 ? 1 : 2;
        }

        rimValue.textContent = rimAssessments[rimIndex];
        rnflValue.textContent = rnflAssessments[rnflIndex];
        onhValue.textContent = onhAssessments[onhIndex];

        rimValue.classList.toggle('high-value', rimIndex > 0);
        rnflValue.classList.toggle('high-value', rnflIndex > 0);
        onhValue.classList.toggle('high-value', onhIndex > 0);

        const riskScore = (cdr > 0.5 ? 1 : 0) + rimIndex + rnflIndex + onhIndex;

        if (riskScore <= 1) {
            diagnosisIndicator.className = 'diagnosis-indicator normal';
            diagnosisText.textContent = 'No signs of glaucoma detected';
            diagnosisConfidence.textContent = confidence + '% Confidence';
            recommendation1.textContent = 'Maintain regular eye check-ups.';
            recommendation2.textContent = 'No immediate action needed.';
        } else if (riskScore <= 3) {
            diagnosisIndicator.className = 'diagnosis-indicator borderline';
            diagnosisText.textContent = 'Borderline signs of glaucoma';
            diagnosisConfidence.textContent = confidence + '% Confidence';
            recommendation1.textContent = 'Consult an ophthalmologist for a detailed evaluation.';
            recommendation2.textContent = 'Schedule a visual field test and OCT scan.';
        } else {
            diagnosisIndicator.className = 'diagnosis-indicator high-risk';
            diagnosisText.textContent = 'High risk of glaucoma detected';
            diagnosisConfidence.textContent = confidence + '% Confidence';
            recommendation1.textContent = 'Immediate consultation with a glaucoma specialist recommended.';
            recommendation2.textContent = 'Start treatment to prevent vision loss.';
        }
    }

