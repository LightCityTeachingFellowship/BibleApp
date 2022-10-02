ppp.addEventListener("click", appendCrossReferences);

// let bversionName = 'KJV';

function appendCrossReferences(e) {
    if (!e.target.matches('#verse_crossref_button')&&!e.target.parentNode.matches('#verse_crossref_button')) {
        return
    }
    let eTarget;
    if(e.target.matches('#verse_crossref_button')){eTarget = e.target.parentNode.parentNode}
    else if(e.target.matches('#verse_crossref_button a')){eTarget = e.target.parentNode.parentNode.parentNode}
    let masterVerseHolder = elmAhasElmOfClassBasAncestor(e.target, '.vmultiple');
    let siblingCrossREF = masterVerseHolder.nextElementSibling;
    if (siblingCrossREF==null || !siblingCrossREF.matches('.crossrefs') || siblingCrossREF==undefined) {
        let refCode = null;
        let vHolder = null;

        masterVerseHolder.classList.add('showing_crossref')

        function getBVN(classesOfe) {
            classesOfe.forEach(cl => {
                if (cl.startsWith('v_')) {
                    bversionName = cl.split('v_')[1];
                    return
                }
            });
        }
        if (eTarget.matches('.verse')) {
            let classesOfe = eTarget.classList;
            getBVN(classesOfe)
            // console.log(bversionName);
        } else if (classesOfe = elmAhasElmOfClassBasAncestor(eTarget, 'verse')) {
            classesOfe = classesOfe.classList;
            getBVN(classesOfe);
            // console.log(bversionName);
        }
        let versionVerse, vmultiple_NextSibling = elmAhasElmOfClassBasAncestor(eTarget, 'vmultiple').nextElementSibling;
        if (eTarget.matches('.vmultiple [ref]') && (vmultiple_NextSibling == null || !vmultiple_NextSibling.matches('.crossrefs'))) {
            refCode = eTarget.getAttribute('ref');
            vHolder = elmAhasElmOfClassBasAncestor(eTarget, 'vmultiple');
            versionVerse = vHolder.querySelector('.v_KJV');
        }
        if (refCode) {
            refCode = refCode.replace(/(\w)\s([0-9]+)/g, '$1.$2'); //Romans 2:3==>Romans.2:3
            refCode = refCode.replace(/:/g, '.'); //Romans.2:3==>Romans.2.3
            let crossRef = crossReferences_fullName[refCode];

            function parseCrossRef(crossRef, refCode) {
                let crfFrag = new DocumentFragment();
                crossRef.forEach(crf => {
                    let crfSpan = document.createElement('SPAN');
                    crfSpan.innerText = crf;
                    crfFrag.append(crfSpan);
                    crfFrag.append('; ');
                });
                let crfDiv = document.createElement('DIV');
                crfDiv.append(crfFrag);
                crfDiv.classList.add('crossrefs');
                vHolder.parentNode.insertBefore(crfDiv, vHolder.nextSibling);
                return crfDiv
            }
            parseCrossRef(crossRef, refCode);
        }
    } else {
        siblingCrossREF.classList.add('slideup')
        setTimeout(() => {
            masterVerseHolder.classList.remove('showing_crossref')
            siblingCrossREF.remove()
        }, 500);
    }
}

function getCrossReference(x) {
    // if(e.target.matches('.crossrefs>span')){
    // let crf2get = e.target.innerText;
    let crf2get = x.innerText;
    let bk = crf2get.split('.')[0]
    let chp1 = Number(crf2get.split('.')[1]);
    let vrs1 = Number(crf2get.split('.')[2]);
    let chp2 = chp1;
    let vrs2 = vrs1;
    let fullBkn;
    bible.Data.books.forEach((ref_, ref_indx) => {
        if (ref_.includes(bk.toUpperCase())) {
            fullBkn = bible.Data.bookNamesByLanguage.en[ref_indx];
            return
        }
    });
    if (crf2get.includes('-')) { //MORE THAN ONE VERSE
        vrs1 = Number(crf2get.split('-')[0].split('.')[2]);
        let ref_secondHalf = crf2get.split('-')[1].split('.')

        //e.g., Gen.1.3-Gen.1.6
        if (ref_secondHalf.length > 1) {
            chp2 = Number(ref_secondHalf[1]);
            vrs2 = Number(ref_secondHalf[2]);
        }
        //e.g., Gen.1.3-6
        else {
            chp2 = chp1;
            vrs2 = Number(ref_secondHalf[0]);
        }
    }
    let refVrsArr = [];
    let vHolder = new DocumentFragment();
    let br = '';
    for (i = vrs1; i < vrs2 + 1; i++) {
        let verseSpan = document.createElement('span');

        function vNum() {
            let verseNum = document.createElement('code');
            verseNum.setAttribute('ref', bk + ' ' + (chp1) + ':' + i);
            verseNum.setAttribute('aria-hidden', 'true'); //so that screen readers ignore the verse numbers
            verseNum.prepend(document.createTextNode(`[${(bk)}.${(chp1)}:${i}]`));
            verseNum.title = bversionName + ' ' + bookName;
            verseSpan.prepend(verseNum);
            // if(br){
            verseSpan.innerHTML = br + verseSpan.innerHTML;
            // }
            // else{verseSpan.innerHTML='<div></div>'+verseSpan.innerHTML;}
        }
        vNum();
        let vText = window[bversionName][fullBkn][chp1 - 1][i - 1]
        // console.log(parseVerseText(vText, verseSpan));
        vHolder.append(parseVerseText(vText, verseSpan));
        br = '<br>';
    }
    return vHolder;
}

// main.addEventListener("click", searchPreviewRefClick)
