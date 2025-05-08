document.addEventListener('DOMContentLoaded', () => {
    const journalText = document.getElementById('journalText');
    const moodSelect = document.getElementById('mood');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editingEntryIdInput = document.getElementById('editingEntryId');
    const formTitle = document.getElementById('formTitle');

    const triggerImageUploadBtn = document.getElementById('triggerImageUploadBtn');
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');

    const entriesContainer = document.getElementById('entriesContainer');
    const trashContainer = document.getElementById('trashContainer');
    const toggleTrashBtn = document.getElementById('toggleTrashBtn');
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');

    const nextMilestoneCountDisplay = document.getElementById('nextMilestoneCountDisplay');
    const currentProgressCountDisplay = document.getElementById('currentProgressCount');
    const milestoneTargetCountDisplay = document.getElementById('milestoneTargetCount');
    const achievementProgressBarFill = document.getElementById('achievementProgressBarFill');
    const unlockedAchievementsList = document.getElementById('unlockedAchievementsList');

    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const loadDraftBtn = document.getElementById('loadDraftBtn');
    const discardDraftBtn = document.getElementById('discardDraftBtn');
    const draftStatus = document.getElementById('draftStatus');

    const openMoodEditorBtn = document.getElementById('openMoodEditorBtn');
    const moodEditorModal = document.getElementById('moodEditorModal');
    const closeMoodEditorBtn = document.getElementById('closeMoodEditorBtn');
    const editingMoodOriginalValueInput = document.getElementById('editingMoodOriginalValue');
    const moodValueInput = document.getElementById('moodValueInput');
    const moodEmojiInput = document.getElementById('moodEmojiInput');
    const moodLabelInput = document.getElementById('moodLabelInput');
    const saveCustomMoodBtn = document.getElementById('saveCustomMoodBtn');
    const cancelCustomMoodEditBtn = document.getElementById('cancelCustomMoodEditBtn');
    const currentMoodOptionsListUI = document.getElementById('currentMoodOptionsList');

    // 新增用户功能相关的 const
    const userArea = document.getElementById('userArea'); // 确保您的 HTML 中有 id="userArea" 的元素
    const userGreeting = document.getElementById('userGreeting'); // 确保 HTML 中有 id="userGreeting"
    const userInputContainer = document.getElementById('userInputContainer'); // 确保 HTML 中有 id="userInputContainer"
    const usernameInput = document.getElementById('usernameInput'); // 确保 HTML 中有 id="usernameInput"
    const saveUsernameBtn = document.getElementById('saveUsernameBtn'); // 确保 HTML 中有 id="saveUsernameBtn"
    const editUsernameBtn = document.getElementById('editUsernameBtn'); // 确保 HTML 中有 id="editUsernameBtn"


    const ENTRIES_KEY = 'journalEntries';
    const TRASH_KEY = 'journalTrash';
    const MAX_IMAGE_SIZE_MB = 2; // 此常量在代码中未直接使用，但保留以备将来使用
    const ACHIEVEMENT_MILESTONE_STEP = 10;
    const ACHIEVEMENTS_STORAGE_KEY = 'journalUserAchievements';
    const TOTAL_SUBMISSIONS_STORAGE_KEY = 'journalTotalSubmissionsCount';
    const DRAFT_STORAGE_KEY = 'journalCurrentDraft';
    const CUSTOM_MOOD_OPTIONS_STORAGE_KEY = 'journalCustomMoodOptions';
    const USERNAME_KEY = 'dairytaleUsername'; // localStorage 的键名 for username

    let currentUsername = ''; // 用于存储当前用户名
    let moodMap = {};
    let currentImageBase64 = null;


    const placeholderPrompts = [
        "此刻，你的心情是哪一抹色彩？",
        "捕捉今日份心情...",
        "有什么特别的瞬间想要留住吗？",
        "今天的 Diarytale 将留住什么？",
        "捕捉今日份的小确幸或小思考...",
        "在此处，为你的 Dairytale 添上温暖的一笔。",
        "今天的天气怎么样？心情呢？",
        "有什么值得感恩的事情吗？",
        "轻轻落笔，你的故事在 Diarytale 中闪耀。",
        "欢迎来到 Diarytale，这里是你专属的故事发生地。不必寻找华丽的辞藻，只需用最真挚的文字，记录下属于你的独特篇章。让每一个平凡的日子，都成为值得回味的传说。",
        "在 Diarytale 的世界里，每一份心情都值得被温柔述说，每一个瞬间都可以谱写成动人的故事。现在，就让你的思绪化为文字，开启今天的 Diarytale 旅程吧。",
        "此刻，你想对未来的自己说什么？",
        "亲爱的故事家，你的 Diarytale 等待着新的章节。无论是生活的点滴感悟，还是不期而遇的小确幸，都将在这里汇聚成独一无二的温暖记忆。"
    ];


    function setRandomPlaceholder() {
        const randomIndex = Math.floor(Math.random() * placeholderPrompts.length);
        journalText.placeholder = placeholderPrompts[randomIndex];
    }

    function getDefaultMoodOptions() {
        return [
            { value: "happy", emoji: "😊", label: "开心" },
            { value: "calm", emoji: "😌", label: "平静" },
            { value: "sad", emoji: "😢", label: "难过" },
            { value: "angry", emoji: "😠", label: "生气" },
            { value: "excited", emoji: "🤩", label: "激动" },
            { value: "tired", emoji: "😴", label: "疲惫" },
            { value: "thoughtful", emoji: "🤔", label: "思考" }
        ];
    }

    function loadMoodOptions() {
        let options = JSON.parse(localStorage.getItem(CUSTOM_MOOD_OPTIONS_STORAGE_KEY));
        if (!options || options.length === 0) {
            options = getDefaultMoodOptions();
            saveMoodOptions(options);
        }
        return options;
    }

    function saveMoodOptions(options) {
        localStorage.setItem(CUSTOM_MOOD_OPTIONS_STORAGE_KEY, JSON.stringify(options));
    }

    function populateMoodDropdownAndBuildMap() {
        const options = loadMoodOptions();
        moodSelect.innerHTML = '';
        moodMap = {};
        options.forEach(opt => {
            const optionElement = document.createElement('option');
            optionElement.value = opt.value;
            optionElement.textContent = `${opt.emoji} ${opt.label}`;
            moodSelect.appendChild(optionElement);
            moodMap[opt.value] = { emoji: opt.emoji, text: opt.label };
        });
    }


    submitBtn.addEventListener('click', handleSubmit);
    cancelEditBtn.addEventListener('click', cancelEditMode);
    toggleTrashBtn.addEventListener('click', () => {
        const isHidden = trashContainer.style.display === 'none';
        trashContainer.style.display = isHidden ? 'block' : 'none';
        toggleTrashBtn.textContent = isHidden ? '隐藏' : '显示';
        if (isHidden) renderTrash();
    });
    emptyTrashBtn.addEventListener('click', handleEmptyTrash);

    triggerImageUploadBtn.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', handleImageSelect);
    removeImageBtn.addEventListener('click', clearImagePreview);

    saveDraftBtn.addEventListener('click', handleSaveDraft);
    loadDraftBtn.addEventListener('click', handleLoadDraft);
    discardDraftBtn.addEventListener('click', handleDiscardDraft);

    openMoodEditorBtn.addEventListener('click', openMoodEditorModal);
    closeMoodEditorBtn.addEventListener('click', closeMoodEditorModal);
    saveCustomMoodBtn.addEventListener('click', handleSaveCustomMood);
    cancelCustomMoodEditBtn.addEventListener('click', resetCustomMoodForm);


    function handleImageSelect(event) {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('请选择一个图片文件！');
                imageUploadInput.value = null;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageBase64 = e.target.result;
                imagePreview.src = currentImageBase64;
                imagePreviewContainer.style.display = 'flex'; // Changed from 'block' to 'flex' for consistency if styling implies it
            };
            reader.onerror = () => {
                alert('读取图片文件失败！');
                clearImagePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    function clearImagePreview() {
        currentImageBase64 = null;
        imagePreview.src = '#';
        imagePreviewContainer.style.display = 'none';
        imageUploadInput.value = null; // Reset file input
    }

    function handleSubmit() {
        const text = journalText.value.trim();
        const moodValue = moodSelect.value;
        const editingId = editingEntryIdInput.value ? parseInt(editingEntryIdInput.value) : null;

        if (!moodValue) {
            alert('请选择一个心情！如果列表为空，请先自定义心情选项。');
            return;
        }
        if (text === '' && !currentImageBase64) {
            alert('日记内容或图片至少需要一项！');
            return;
        }

        if (editingId) {
            updateEntry(editingId, text, moodValue, currentImageBase64);
        } else {
            addEntry(text, moodValue, currentImageBase64);
            let totalSubmissions = loadTotalSubmissions();
            totalSubmissions++;
            saveTotalSubmissions(totalSubmissions);
            checkAndUnlockNewAchievements(totalSubmissions);
        }
        clearForm();
        clearDraftData(); // Clear draft after successful submission
        updateDraftButtonVisibility();
        renderEntries();
        updateAchievementsDisplay();
    }

    function addEntry(text, moodValue, imageDataUrl) {
        const now = new Date();
        const newEntry = {
            id: Date.now(),
            date: formatDate(now),
            time: formatTime(now),
            moodValue: moodValue,
            text: text,
            imageDataUrl: imageDataUrl
        };
        let entries = getStoredData(ENTRIES_KEY);
        entries.unshift(newEntry); // Add new entries to the beginning
        saveStoredData(ENTRIES_KEY, entries);
    }

    function updateEntry(id, newText, newMoodValue, newImageDataUrl) {
        let entries = getStoredData(ENTRIES_KEY);
        const entryIndex = entries.findIndex(entry => entry.id === id);
        if (entryIndex > -1) {
            entries[entryIndex].text = newText;
            entries[entryIndex].moodValue = newMoodValue;
            entries[entryIndex].imageDataUrl = newImageDataUrl; // Update image data
            entries[entryIndex].modifiedDate = formatDate(new Date());
            entries[entryIndex].modifiedTime = formatTime(new Date());
        }
        saveStoredData(ENTRIES_KEY, entries);
        cancelEditMode(); // Exit edit mode after update
    }

    function deleteEntry(id) {
        if (!confirm('暂别这篇日记？')) return;
        let entries = getStoredData(ENTRIES_KEY);
        let trash = getStoredData(TRASH_KEY);
        const entryIndex = entries.findIndex(entry => entry.id === id);
        if (entryIndex > -1) {
            const [deletedEntry] = entries.splice(entryIndex, 1);
            trash.unshift(deletedEntry); // Add to trash
            saveStoredData(ENTRIES_KEY, entries);
            saveStoredData(TRASH_KEY, trash);
            renderEntries();
            if (trashContainer.style.display !== 'none') renderTrash(); // Re-render trash if visible
        }
    }

    function restoreEntry(id) {
        let entries = getStoredData(ENTRIES_KEY);
        let trash = getStoredData(TRASH_KEY);
        const trashIndex = trash.findIndex(entry => entry.id === id);
        if (trashIndex > -1) {
            const [restoredEntry] = trash.splice(trashIndex, 1);
            entries.unshift(restoredEntry); // Restore to main entries
            saveStoredData(ENTRIES_KEY, entries);
            saveStoredData(TRASH_KEY, trash);
            renderEntries();
            renderTrash(); // Always re-render trash after restoration
        }
    }

    function permanentlyDeleteEntry(id) {
        if (!confirm('是否要让这篇日记向 Diarytale 道别，从此不再展现？')) return;
        let trash = getStoredData(TRASH_KEY);
        trash = trash.filter(entry => entry.id !== id);
        saveStoredData(TRASH_KEY, trash);
        renderTrash();
    }

    function handleEmptyTrash() {
        const trash = getStoredData(TRASH_KEY);
        if (trash.length === 0) {
            alert('空空如也，如未曾书写的一页。');
            return;
        }
        if (confirm('清空回收站，这些昔日的篇章与心迹将永久封存，无法复原。是否继续？')) {
            saveStoredData(TRASH_KEY, []);
            renderTrash();
            alert('旧忆已清，Dairytale 为你留出新的空间。');
        }
    }

    function startEditMode(entry) {
        formTitle.textContent = '编辑日记';
        journalText.value = entry.text;
        moodSelect.value = entry.moodValue;
        editingEntryIdInput.value = entry.id;
        submitBtn.textContent = '✨ 更新日记';
        cancelEditBtn.style.display = 'inline-block';

        if (entry.imageDataUrl) {
            currentImageBase64 = entry.imageDataUrl;
            imagePreview.src = currentImageBase64;
            imagePreviewContainer.style.display = 'flex';
        } else {
            clearImagePreview();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for editing
    }

    function cancelEditMode() {
        formTitle.textContent = '落笔处'; // Or your default title
        clearForm(); // This will also clear image preview and other fields
        editingEntryIdInput.value = '';
        submitBtn.textContent = '✨ 珍藏此刻';
        cancelEditBtn.style.display = 'none';
    }

    async function handleShare(entry) {
        const baseUrl = window.location.href.split('#')[0].split('?')[0];
        const entryUrl = `${baseUrl}#entry=${entry.id}`;

        try {
            await navigator.clipboard.writeText(entryUrl);
            alert('日记专属链接已复制到剪贴板！\n您可以在本机此浏览器使用此链接快速回顾这条日记。');
        } catch (err) {
            console.error('复制链接失败:', err);
            alert('复制链接失败。请手动复制以下链接：\n' + entryUrl);
        }
    }

    function processUrlHash() {
        if (window.location.hash && window.location.hash.startsWith('#entry=')) {
            const entryIdToFind = parseInt(window.location.hash.substring('#entry='.length));
            if (!isNaN(entryIdToFind)) {
                const entries = getStoredData(ENTRIES_KEY);
                const entryExists = entries.some(entry => entry.id === entryIdToFind);

                if (!entryExists) {
                     setTimeout(() => { // Delay alert to allow page render
                        alert('无法在当前列表中找到指定的日记条目。它可能已被删除或在回收站中。');
                    }, 100);
                    history.replaceState(null, document.title, window.location.pathname + window.location.search); // Clean URL
                    return;
                }

                renderEntries(); // Ensure entries are rendered before trying to scroll

                setTimeout(() => { // Delay scroll and highlight
                    const entryElement = document.querySelector(`.entry[data-id='${entryIdToFind}']`);
                    if (entryElement) {
                        entryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        entryElement.classList.add('highlighted-entry');
                        setTimeout(() => {
                            entryElement.classList.remove('highlighted-entry');
                        }, 3000); // Highlight duration
                    } else {
                         alert('无法在页面上定位到指定的日记条目。');
                    }
                    history.replaceState(null, document.title, window.location.pathname + window.location.search); // Clean URL after processing
                }, 100); // Small delay for DOM updates
            } else {
                 history.replaceState(null, document.title, window.location.pathname + window.location.search); // Clean invalid hash
            }
        }
    }

    function loadTotalSubmissions() {
        return parseInt(localStorage.getItem(TOTAL_SUBMISSIONS_STORAGE_KEY)) || 0;
    }

    function saveTotalSubmissions(count) {
        localStorage.setItem(TOTAL_SUBMISSIONS_STORAGE_KEY, count);
    }

    function loadUnlockedAchievements() {
        return JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)) || [];
    }

    function saveUnlockedAchievements(achievements) {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
    }

    function checkAndUnlockNewAchievements(totalSubmissions) {
        let unlocked = loadUnlockedAchievements();
        const currentAchievementTier = Math.floor(totalSubmissions / ACHIEVEMENT_MILESTONE_STEP);
        let newAchievementUnlocked = false;

        for (let i = 1; i <= currentAchievementTier; i++) {
            const milestoneValue = i * ACHIEVEMENT_MILESTONE_STEP;
            const achievementName = `坚持记录 ${milestoneValue} 篇！`;
            const alreadyUnlocked = unlocked.some(ach => ach.name === achievementName);

            if (!alreadyUnlocked) {
                unlocked.push({
                    name: achievementName,
                    milestone: milestoneValue,
                    date: formatDate(new Date()),
                    icon: '🏆' // Default icon
                });
                newAchievementUnlocked = true;
            }
        }

        if (newAchievementUnlocked) {
            saveUnlockedAchievements(unlocked);
            alert('新成就解锁！快去看看吧！'); // Notify user
        }
    }

    function updateAchievementsDisplay() {
        const totalSubmissions = loadTotalSubmissions();
        const unlocked = loadUnlockedAchievements();

        const currentMilestoneProgress = totalSubmissions % ACHIEVEMENT_MILESTONE_STEP;
        const nextMilestoneNumber = (Math.floor(totalSubmissions / ACHIEVEMENT_MILESTONE_STEP) + 1) * ACHIEVEMENT_MILESTONE_STEP;

        nextMilestoneCountDisplay.textContent = nextMilestoneNumber;
        currentProgressCountDisplay.textContent = currentMilestoneProgress; // Corrected display
        milestoneTargetCountDisplay.textContent = ACHIEVEMENT_MILESTONE_STEP;

        let progressBarFillPercent = (currentMilestoneProgress / ACHIEVEMENT_MILESTONE_STEP) * 100;
         if (totalSubmissions > 0 && currentMilestoneProgress === 0 && totalSubmissions >=ACHIEVEMENT_MILESTONE_STEP) {
             // If exactly on a milestone (and not 0 submissions), show 100% for that milestone completion
             progressBarFillPercent = 100;
        }
        achievementProgressBarFill.style.width = progressBarFillPercent + '%';

        unlockedAchievementsList.innerHTML = ''; // Clear previous list
        if (unlocked.length === 0) {
            const p = document.createElement('p');
            p.classList.add('no-achievements');
            p.textContent = '还没有解锁任何成就，继续努力吧！';
            unlockedAchievementsList.appendChild(p);
        } else {
            unlocked.sort((a, b) => a.milestone - b.milestone); // Sort by milestone
            unlocked.forEach(ach => {
                const achDiv = document.createElement('div');
                achDiv.classList.add('achievement-item');
                achDiv.innerHTML = `
                    <span class="achievement-icon">${ach.icon || '🏆'}</span>
                    <div class="achievement-details">
                        <p>${ach.name}</p>
                        <span>解锁于: ${ach.date}</span>
                    </div>
                `;
                unlockedAchievementsList.appendChild(achDiv);
            });
        }
    }

    function handleSaveDraft() {
        const text = journalText.value; // Don't trim, user might want leading/trailing spaces in draft
        const moodValue = moodSelect.value;

        if (text.trim() === '' && !currentImageBase64) { // Still check for actual content
            alert('没有内容可以保存为草稿。');
            return;
        }
         if (!moodValue && (text.trim() !== '' || currentImageBase64)) {
            // If there's content but no mood, it's good to prompt for mood for a "complete" draft
            alert('请选择一个心情来保存草稿，让回忆更完整哦。');
            return;
        }


        const draftData = {
            text: text,
            moodValue: moodValue,
            imageDataUrl: currentImageBase64,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        alert('草稿已保存！');
        updateDraftButtonVisibility();
    }

    function handleLoadDraft() {
        const draftString = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftString) {
            // Check if current form has unsaved changes (excluding draft itself)
            if (editingEntryIdInput.value === '' && (journalText.value.trim() !== '' || currentImageBase64 || moodSelect.value !== loadMoodOptions()[0]?.value)) {
                if (!confirm('当前表单有内容，加载草稿会覆盖现有内容。确定要加载吗？')) {
                    return;
                }
            }
            const draftData = JSON.parse(draftString);
            journalText.value = draftData.text || '';
            moodSelect.value = draftData.moodValue || (loadMoodOptions()[0]?.value || '');
            if (draftData.imageDataUrl) {
                currentImageBase64 = draftData.imageDataUrl;
                imagePreview.src = currentImageBase64;
                imagePreviewContainer.style.display = 'flex';
            } else {
                clearImagePreview();
            }
            alert('草稿已加载！');
            // Reset edit mode if loading draft
            editingEntryIdInput.value = '';
            formTitle.textContent = '落笔处 (草稿已加载)';
            submitBtn.textContent = '✨ 珍藏此刻';
            cancelEditBtn.style.display = 'none';

        } else {
            alert('没有找到已保存的草稿。');
        }
    }

    function handleDiscardDraft() {
        if (confirm('确定要丢弃已保存的草稿吗？此操作无法撤销。')) {
            clearDraftData();
            alert('草稿已丢弃。');
            // If form was showing "draft loaded", clear form content as well
            if (formTitle.textContent.includes('(草稿已加载)')) {
                clearForm(); // This resets title and placeholder
            }
        }
    }

    function clearDraftData(){
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        updateDraftButtonVisibility();
    }

    function updateDraftButtonVisibility() {
        const draftString = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftString) {
            const draftData = JSON.parse(draftString);
            const savedDate = new Date(draftData.savedAt);
            draftStatus.textContent = `草稿保存于: ${formatDate(savedDate)} ${formatTime(savedDate)}`;
            loadDraftBtn.style.display = 'inline-block';
            discardDraftBtn.style.display = 'inline-block';
        } else {
            draftStatus.textContent = '';
            loadDraftBtn.style.display = 'none';
            discardDraftBtn.style.display = 'none';
        }
    }

    function openMoodEditorModal() {
        moodEditorModal.style.display = 'flex'; // Use flex for centering
        renderMoodOptionsInEditor();
        resetCustomMoodForm();
    }

    function closeMoodEditorModal() {
        moodEditorModal.style.display = 'none';
    }

    function renderMoodOptionsInEditor() {
        const options = loadMoodOptions();
        currentMoodOptionsListUI.innerHTML = ''; // Clear list
        if (options.length === 0) {
            currentMoodOptionsListUI.innerHTML = '<li>你的心情色盘尚待描绘，何不为此刻的感受赋予专属的色彩？</li>';
            return;
        }
        options.forEach(opt => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="mood-display">${opt.emoji} ${opt.label} (值: ${opt.value})</span>
                <span class="mood-actions">
                    <button class="edit-mood-btn" data-value="${opt.value}" title="编辑">✏️</button>
                    <button class="delete-mood-btn" data-value="${opt.value}" title="删除">🗑️</button>
                </span>
            `;
            li.querySelector('.edit-mood-btn').addEventListener('click', () => startEditCustomMood(opt));
            li.querySelector('.delete-mood-btn').addEventListener('click', () => deleteCustomMood(opt.value));
            currentMoodOptionsListUI.appendChild(li);
        });
    }

    function resetCustomMoodForm() {
        editingMoodOriginalValueInput.value = '';
        moodValueInput.value = '';
        moodEmojiInput.value = '';
        moodLabelInput.value = '';
        moodValueInput.disabled = false; // Allow editing value for new moods
        saveCustomMoodBtn.textContent = '保存心情'; // Changed from '添加新心情' for generic use
        cancelCustomMoodEditBtn.style.display = 'none';
    }

    function startEditCustomMood(moodOption) {
        editingMoodOriginalValueInput.value = moodOption.value;
        moodValueInput.value = moodOption.value;
        moodEmojiInput.value = moodOption.emoji;
        moodLabelInput.value = moodOption.label;
        moodValueInput.disabled = true; // Value is the ID, should not be changed on edit
        saveCustomMoodBtn.textContent = '更新此心情';
        cancelCustomMoodEditBtn.style.display = 'inline-block';
    }

    function deleteCustomMood(valueToDelete) {
        const options = loadMoodOptions();
        if (options.length <= 1) {
            alert('心情是 Diarytale 故事的呼吸，请至少保留一种让它倾诉的方式。');
            return;
        }
        if (confirm(`确定要让 "${valueToDelete}" 这份心情从您的Diarytale中隐去吗？\n 过往篇章里那些借由它抒发的情感，将可能无法再被完整解读。`)) {
            const updatedOptions = options.filter(opt => opt.value !== valueToDelete);
            saveMoodOptions(updatedOptions);
            populateMoodDropdownAndBuildMap(); // Update main dropdown
            renderMoodOptionsInEditor(); // Update list in modal
        }
    }

    function handleSaveCustomMood() {
        const originalValue = editingMoodOriginalValueInput.value; // For edits
        const newValue = moodValueInput.value.trim(); // For new moods
        const emoji = moodEmojiInput.value.trim();
        const label = moodLabelInput.value.trim();

        if (!emoji || !label) {
            alert('Emoji 和标签文本不能为空！');
            return;
        }

        let options = loadMoodOptions();

        if (originalValue) { // Edit mode
            const optionToEdit = options.find(opt => opt.value === originalValue);
            if (optionToEdit) {
                optionToEdit.emoji = emoji;
                optionToEdit.label = label;
                // Value (ID) is not changed
            }
        } else { // Add new mode
            if (!newValue) {
                alert('“值”不能为空！它将作为此心情的唯一标识。');
                return;
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(newValue)) {
                alert('“值”只能包含英文字母、数字、下划线(_)或连字符(-)。例如: "very_happy", "excited-mood1".');
                return;
            }
            if (options.some(opt => opt.value === newValue)) {
                alert(`值为 "${newValue}" 的心情已存在，请使用不同的值。`);
                return;
            }
            options.push({ value: newValue, emoji: emoji, label: label });
        }

        saveMoodOptions(options);
        populateMoodDropdownAndBuildMap(); // Update main dropdown
        renderMoodOptionsInEditor(); // Update list in modal
        resetCustomMoodForm(); // Clear form for next action
    }

    function renderEntries() {
        renderDataList(entriesContainer, getStoredData(ENTRIES_KEY), 'entries', createEntryDOM);
    }

    function renderTrash() {
        renderDataList(trashContainer, getStoredData(TRASH_KEY), 'trash', createTrashEntryDOM);
    }

    function renderDataList(container, data, type, domCreator) {
        container.innerHTML = ''; // Clear previous items
        if (data.length === 0) {
            const noDataMsg = document.createElement('p');
            noDataMsg.classList.add(type === 'entries' ? 'no-entries' : 'no-entries-trash');
            noDataMsg.textContent = type === 'entries' ? '此刻寂静无声，只因最美的故事尚未落笔。来 Diarytale，赋予今天独特的意义吧。' : '回收站里没有被遗忘的故事。';
            container.appendChild(noDataMsg);
            return;
        }
        data.forEach(item => container.appendChild(domCreator(item)));
    }

    function createEntryDOM(entry) {
        const moodInfo = moodMap[entry.moodValue] || { emoji: '❓', text: `未知 (${entry.moodValue})` };
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.dataset.id = String(entry.id); // For easy selection

        let modifiedText = "";
        if (entry.modifiedDate) {
            modifiedText = `<span class="entry-modified">(编辑于 ${entry.modifiedDate} ${entry.modifiedTime || ''})</span>`;
        }

        let imageHTML = "";
        if (entry.imageDataUrl) {
            imageHTML = `
                <div class="entry-image-container">
                    <img src="${entry.imageDataUrl}" alt="日记图片" class="entry-image">
                </div>
            `;
        }

        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${entry.date} ${entry.time} ${modifiedText}</span>
                <span class="entry-mood" title="${moodInfo.text}">${moodInfo.emoji} ${moodInfo.text}</span>
            </div>
            ${imageHTML}
            <p class="entry-text" style="${entry.text ? '' : 'display:none;'}">${escapeHTML(entry.text)}</p>
            <div class="entry-actions">
                <button class="edit-btn" title="编辑">✏️</button>
                <button class="delete-btn" title="删除">🗑️</button>
                <button class="share-btn" title="分享链接">🔗</button>
            </div>
        `;
        entryDiv.querySelector('.edit-btn').addEventListener('click', () => startEditMode(entry));
        entryDiv.querySelector('.delete-btn').addEventListener('click', () => deleteEntry(entry.id));
        entryDiv.querySelector('.share-btn').addEventListener('click', () => handleShare(entry));
        return entryDiv;
    }

    function createTrashEntryDOM(entry) {
        const moodInfo = moodMap[entry.moodValue] || { emoji: '❓', text: `未知 (${entry.moodValue})` };
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry'); // Reuse .entry styling
        entryDiv.dataset.id = String(entry.id);

        let imageHTML = "";
        if (entry.imageDataUrl) {
            imageHTML = `
                <div class="entry-image-container">
                    <img src="${entry.imageDataUrl}" alt="日记图片" class="entry-image">
                </div>
            `;
        }

        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${entry.date} ${entry.time}</span>
                <span class="entry-mood" title="${moodInfo.text}">${moodInfo.emoji} ${moodInfo.text}</span>
            </div>
            ${imageHTML}
            <p class="entry-text" style="${entry.text ? '' : 'display:none;'}">${escapeHTML(entry.text)}</p>
            <div class="trash-entry-actions">
                <button class="restore-btn" title="恢复">♻️</button>
                <button class="permanently-delete-btn" title="彻底删除">❌</button>
            </div>
        `;
        entryDiv.querySelector('.restore-btn').addEventListener('click', () => restoreEntry(entry.id));
        entryDiv.querySelector('.permanently-delete-btn').addEventListener('click', () => permanentlyDeleteEntry(entry.id));
        return entryDiv;
    }

    function getStoredData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    function saveStoredData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') { // Check for different browser errors
                alert('存储空间已满！可能无法保存更多日记或图片。请尝试清理一些旧的或带有大图片的条目，或在浏览器设置中增加本站点的存储配额。');
            } else {
                console.error('保存到localStorage失败:', e);
                alert('保存数据时发生未知错误。部分更改可能未保存。');
            }
        }
    }

    function clearForm() {
        journalText.value = '';
        const currentMoodOptions = loadMoodOptions();
        moodSelect.value = currentMoodOptions.length > 0 ? currentMoodOptions[0].value : ''; // Default to first mood

        clearImagePreview();
        editingEntryIdInput.value = ''; // Clear editing ID
        formTitle.textContent = '落笔处'; // Reset title
        submitBtn.textContent = '✨ 珍藏此刻';
        cancelEditBtn.style.display = 'none'; // Hide cancel edit button
        setRandomPlaceholder(); // Set a new random placeholder
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function escapeHTML(str) {
        if (typeof str !== 'string') return ''; // Ensure input is a string
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;',
                "'": '&#39;', '"': '&quot;'
            }[tag] || tag)
        );
    }

    // --- 用户名功能函数 ---
    function loadUsername() {
        // Ensure all user-related elements exist before proceeding
        if (!userArea || !userGreeting || !userInputContainer || !usernameInput || !saveUsernameBtn || !editUsernameBtn) {
            console.warn("User-related DOM elements not found. Username feature may not work correctly.");
            return;
        }

        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (storedUsername) {
            currentUsername = storedUsername;
            displayUserGreeting(currentUsername);
        } else {
            displayUsernameInput();
        }
    }

    function displayUserGreeting(name) {
        if (!userGreeting || !userInputContainer || !editUsernameBtn) return; // Guard against null elements

        userGreeting.innerHTML = `故事家  <span class="username">${escapeHTML(name)}</span>，欢迎回到属于你的文字世界。`;
        userGreeting.style.display = 'block';
        userInputContainer.style.display = 'none';
        editUsernameBtn.style.display = 'inline-block';

        // Re-apply animation for greeting
        userGreeting.style.animation = 'none';
        userGreeting.offsetHeight; /* trigger reflow */
        userGreeting.style.animation = '';
    }

    function displayUsernameInput() {
        if (!userGreeting || !userInputContainer || !editUsernameBtn || !usernameInput) return; // Guard

        userGreeting.style.display = 'none';
        userInputContainer.style.display = 'flex'; // Use flex for input and button
        editUsernameBtn.style.display = 'none';
        usernameInput.value = currentUsername || ''; // Pre-fill if editing, else empty
        usernameInput.focus();

        // Re-apply animation for input container
        userInputContainer.style.animation = 'none';
        userInputContainer.offsetHeight; /* trigger reflow */
        userInputContainer.style.animation = '';
    }

    function handleSaveUsername() {
        if (!usernameInput) return; // Guard

        const newUsername = usernameInput.value.trim();
        if (newUsername === '') {
            alert('昵称不能为空哦！');
            usernameInput.focus();
            return;
        }
        if (newUsername.length > 15) { // Example length limit
            alert('昵称有点太长了，15个字以内就好啦。');
            usernameInput.focus();
            return;
        }
        currentUsername = newUsername;
        localStorage.setItem(USERNAME_KEY, currentUsername);
        displayUserGreeting(currentUsername);
    }

    // Event listeners for username feature (ensure elements exist)
    if (saveUsernameBtn) {
        saveUsernameBtn.addEventListener('click', handleSaveUsername);
    }
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if it's in a form
                handleSaveUsername();
            }
        });
    }
    if (editUsernameBtn) {
        editUsernameBtn.addEventListener('click', () => {
            displayUsernameInput();
            // No need to pre-fill here, displayUsernameInput already does it using currentUsername
        });
    }

    // --- 初始化调用 ---
    loadUsername(); // Load username first
    setRandomPlaceholder();
    populateMoodDropdownAndBuildMap();
    renderEntries();
    processUrlHash(); // Process after entries are rendered
    updateAchievementsDisplay();
    updateDraftButtonVisibility();
    window.addEventListener('hashchange', processUrlHash, false);
});