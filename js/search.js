// 搜索功能实现
(function() {
    // 获取搜索相关元素
    const searchBtn = document.querySelector('.search-btn');
    const searchPopup = document.createElement('div');
    const searchMain = document.createElement('div');
    const searchInput = document.createElement('input');
    const searchResult = document.createElement('div');
    
    // 创建搜索弹窗结构
    searchPopup.className = 'search-popup';
    searchMain.className = 'search-main';
    searchInput.className = 'search-input';
    searchInput.placeholder = '输入搜索关键词...';
    searchResult.className = 'search-result';
    
    searchMain.appendChild(searchInput);
    searchMain.appendChild(searchResult);
    searchPopup.appendChild(searchMain);
    document.body.appendChild(searchPopup);
    
    // 点击搜索按钮显示搜索弹窗
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchPopup.classList.add('show');
            searchInput.focus();
        });
    }
    
    // 点击弹窗外部关闭搜索弹窗
    searchPopup.addEventListener('click', function(e) {
        if (e.target === searchPopup) {
            searchPopup.classList.remove('show');
        }
    });
    
    // ESC键关闭搜索弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchPopup.classList.remove('show');
        }
    });
    
    // 搜索功能实现
    searchInput.addEventListener('input', function() {
        const keyword = this.value.trim().toLowerCase();
        
        if (keyword.length <= 0) {
            searchResult.innerHTML = '<div class="search-result-empty">请输入搜索关键词</div>';
            return;
        }
        
        // 获取搜索数据
        fetch('/search.xml')
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                const entries = data.querySelectorAll('entry');
                let results = [];
                
                // 遍历搜索数据
                entries.forEach(entry => {
                    const title = entry.querySelector('title').textContent.toLowerCase();
                    const content = entry.querySelector('content').textContent.toLowerCase();
                    const url = entry.querySelector('url').textContent;
                    
                    // 匹配标题或内容
                    if (title.includes(keyword) || content.includes(keyword)) {
                        results.push({
                            title: entry.querySelector('title').textContent,
                            content: entry.querySelector('content').textContent,
                            url: url
                        });
                    }
                });
                
                // 显示搜索结果
                displayResults(results, keyword);
            })
            .catch(error => {
                console.error('搜索出错:', error);
                searchResult.innerHTML = '<div class="search-result-empty">搜索出错，请稍后重试</div>';
            });
    });
    
    // 显示搜索结果
    function displayResults(results, keyword) {
        if (results.length === 0) {
            searchResult.innerHTML = '<div class="search-result-empty">未找到相关结果</div>';
            return;
        }
        
        let resultHTML = '<ul class="search-result-list">';
        results.slice(0, 10).forEach(result => {
            // 简化内容显示
            let content = result.content.replace(/<[^>]+>/g, '');
            if (content.length > 100) {
                content = content.substring(0, 100) + '...';
            }
            
            resultHTML += `
                <li class="search-result-item">
                    <a href="${result.url}" class="search-result-title">${result.title}</a>
                    <div class="search-result-content">${content}</div>
                </li>
            `;
        });
        resultHTML += '</ul>';
        
        searchResult.innerHTML = resultHTML;
    }
})();