//抓取遮罩位置
function stepMask(stepNum) {
    if (stepNum) {
        // 抓取指定步驟的遮罩位置
        setMaskPosition(stepNum);
    } else {
        // 抓取所有遮罩位置
        $('.step-mask').each(function(index) {
            var stepNum = index + 1;
            setMaskPosition(stepNum);
        });
    }
}

//設置遮罩位置
function setMaskPosition(stepNum) {
    var $stepArea = $('.step-area.step' + stepNum);
    var $stepMask = $('.step-mask.step' + stepNum);
    var $stepContent = $stepMask.find('.step-content');

    // 取得位置、長寬
    var offsetX = $stepArea.offset().left;
    var offsetY = $stepArea.offset().top;
    var width = $stepArea.outerWidth();
    var height = $stepArea.outerHeight();

    // 擴增上下左右各10px
    var expand_offsetX = offsetX - 10;
    var expand_offsetY = offsetY - 10;
    var expand_width = width + 20;
    var expand_height = height + 20;

    // 遮罩位置
    $stepMask.css({
        'mask-size': '100% 100%, ' + expand_width + 'px ' + expand_height + 'px',
        'mask-position': 'center center, ' + expand_offsetX + 'px ' + expand_offsetY + 'px'
    });
    
    //if($stepMask.is(':visible')){
        // 遮罩文案位置
        $stepContent.css({
            'width': expand_width,
            'height': expand_height,
            'top': expand_offsetY,
            'left': expand_offsetX
        });

        // 遮罩文案popover
        var popover = new bootstrap.Popover($stepContent, {
            html: true,
            trigger: 'manual'
        });
        popover.show();  
    
        //為popover增加data-num，用於css樣式設計
        $stepContent.on('shown.bs.popover', function () { 
            var $target = $(event.target).find('.step-num');
            var text = $target.text();
            $target.attr('data-num', text);
        });
   // }
}

//顯示步驟
function showStep(currentNum, prepareNum, recordNum) { 
    //清除所有顯示的popover
    $('.step-popover').remove();
    
    //顯示當前區域及遮罩
    $('.step' + currentNum).show().siblings('.step-area, .step-mask').hide();
    
    //抓取當前遮罩位置  
    stepMask(currentNum);  
    
    //前往當前遮罩位置 
    $('html,body').animate({scrollTop: $('.step-mask.step' + currentNum + ' .step-content').css('top')}, 800);  
        
    //顯示當前popover
    let currentPovover = $('.step-mask.step' + currentNum).find('.step-content').attr('aria-describedby');
    $('#'+ currentPovover).show().siblings('.step-popover').remove(); 

    //當前popover > [OK]  
    $('#'+ currentPovover).find('.btn').off('click').on('click', function() {   
        currentNum++;   
        showStep(currentNum, prepareNum, recordNum);
    }); 
        
    //倒數準備、錄製檔案、開始測驗 顯示時機
    if(currentNum < prepareNum){
        $('.prepare, .record, .start').hide(); 
    }
    else if(currentNum === prepareNum){
        $('.record, .start').hide();   
    }
    else if(currentNum === recordNum){
        $('.prepare, .start').hide();         
    }
    else if (currentNum === $('.step-mask').length){
        $('.prepare').hide(); 
        $('.record, .start').show();  
    }
    else if (currentNum === null){ 
        $('.prepare, .record, .start').show();  
    }
}