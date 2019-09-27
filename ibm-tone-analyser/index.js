const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const otcsv = require('objects-to-csv');
const csv = require('csvtojson');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2019-09-10',  //2017-09-21
  iam_apikey: '4jgAvpQ_WklKSu-3d5tUQjlQdy9CD7rxoUTEJcNliw6K',
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api'
});

// Read transcripts file
async function readFiles() { 
    const transcriptData = await csv().fromFile('../data/viz/transcripts.csv'); 
    const profileData = await csv().fromFile('../data/viz/profile-data.csv'); 
    return {
        transcriptData,
        profileData
    };
}

const allTones = ['Fear', 'Anger', 'Confident', 'Joy', 'Sadness', 'Analytical', 'Tentative'];

readFiles().then(async (oData) => {

    const aTranscripts = oData.transcriptData;
    const aProfiles = oData.profileData;

    // Merge transcripts per user
    const oTranscripts = {};

    aTranscripts.forEach(function(oT){
        const uid = oT['User ID'];

        oTranscripts[uid] = oTranscripts[uid] || {text: ''};

        oTranscripts[uid].id = uid;

        if (!!oT['Processed Text']) {
            oTranscripts[uid].text += oT['Processed Text'] + '.'
        }
    });

    const aTextToAnalyse = Object.values(oTranscripts);

    

    console.log('Records: ', aTextToAnalyse.length);

    const aData = await analyseTones(aTextToAnalyse, aProfiles);
    
    console.log('writing file...');

    const csvData = new otcsv(aData);

    // Write data to disk
    // 
    csvData.toDisk('../data/viz/analysed-dataset-full.csv');  
});


async function analyseTones(aData, aProfiles){
    
    // create map of profiles
    const oProfiles = {};
    aProfiles.forEach(function(p){
        // add all tone columns
        allTones.forEach((t) => p[t] = 0);

        oProfiles[p.ID] = p;
    });

    while(aData.length){

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log(aData.length);

        const oD = aData.pop();
        const sText = oD.text;

        const oRow = oProfiles[oD.id];
        
        if(!!sText){

            const toneParams = {
                tone_input: { 'text': sText },
                content_type: 'application/json',
            };
            
            try {
            
                const toneAnalysis = await toneAnalyzer.tone(toneParams);

                console.log(JSON.stringify(toneAnalysis));

                // add tones as new columns
                toneAnalysis.document_tone.tones.forEach(function(tone){
                    console.log(`${tone.tone_name} = ${tone.score}`);
                    oRow[tone.tone_name] = tone.score;
                });
            
            }catch(e){
                console.log('error:', e);
            }
        }
        
    }

    const aProcessedData = Object.values(oProfiles);

    console.log('returning... aData');
    return aProcessedData.reverse();

}