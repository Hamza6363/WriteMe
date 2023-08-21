var request = require('request');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');

exports.copy_writer = [
    ((req, res) => {
        checkAIUsage(req).then((function (n) {
            if (n) {
                var a = req.body.keywords,
                    r = req.body.keywords2,
                    i = req.body.productName,
                    p = req.body.productName2,
                    o = req.body.tone,
                    s = req.body.language,
                    l = req.body.copy,
                    c = req.body.text,
                    d = (req.body.temp, req.body.k, req.body.n, req.body.usecase),
                    y = {
                        AdsforSocialMedia: {
                            prompt: `Translate this in ${s}. Write ${o} ad to run on social media for the following keywords ${a} and product description ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            stop: ["Title:", "Description:"],
                            engine: "text-davinci-003"
                        },
                        AdsforGoogleSearch: {
                            prompt: `Translate this in ${s}. Write ${o} ad to run on search engines for following keywords ${a} and product description ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        AdandPostCaptionIdeas: {
                            prompt: `Translate this in ${s}. Write ${o} ad or post caption for the following idea ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        AppTitle: {
                            prompt: `Translate this in ${s}. Write ${o} google play store app title for following keywords ${a} and product description ${i}.`,
                            temperature: .72,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: .32,
                            presence_penalty: .6,
                            engine: "text-davinci-003"
                        },
                        AppShortDescription: {
                            prompt: `Translate this in ${s}. Write ${o} google play store app short description for following keywords ${a} and product description ${i}.`,
                            temperature: .72,
                            max_tokens: 250,
                            top_p: 1,
                            n: l,
                            frequency_penalty: .32,
                            presence_penalty: .6,
                            engine: "text-davinci-003"
                        },
                        AppLongDescription: {
                            prompt: `Translate this in ${s}. Write ${o} google play store app long description for following keywords ${a} and product description ${i}.`,
                            temperature: .72,
                            max_tokens: 350,
                            top_p: 1,
                            n: l,
                            frequency_penalty: .32,
                            presence_penalty: .6,
                            engine: "text-davinci-003"
                        },
                        BiddingProposalDescription: {
                            prompt: `Translate this in ${s}. Write ${o} bidding proposal for freelance websites with following details ${i}.`,
                            temperature: .8,
                            max_tokens: 350,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BlogIdea: {
                            prompt: `Translate this in ${s}. Write an article heading for following keywords ${a}.`,
                            temperature: .8,
                            max_tokens: 150,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            stop: ["\n"],
                            engine: "text-davinci-003"
                        },
                        BlogOutline: {
                            prompt: `Translate this in ${s}. Write an article outline for following topic ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BlogSectionWriting: {
                            prompt: `Translate this in ${s}. Write a detailed paragraph in ${o} tone for following topic ${i} and keywords ${a}.`,
                            temperature: .8,
                            max_tokens: 150,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BlogPostIntroduction: {
                            prompt: `Translate this in ${s}. Write an article introduction paragraph in ${o} tone for following topic ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BlogPostConclusion: {
                            prompt: `Translate this in ${s}. Write an article conclusion paragraph in ${o} tone for following topic ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BrandName: {
                            prompt: `Translate this in ${s}. Write a ${o} list of brand names where brand description is ${i}.`,
                            temperature: .8,
                            max_tokens: 150,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BusinessIdeaPitch: {
                            prompt: `Translate this in ${s}. Write ${o} business idea pitch where business idea is ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        BusinessIdeas: {
                            prompt: `Translate this in ${s}. Write ${o} business idea where interest is ${a} and skills are ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        CalltoAction: {
                            prompt: `Translate this in ${s}. Write ${o} call to action for the following description ${i}.`,
                            temperature: .64,
                            max_tokens: 15,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        CopywritingFrameworkAIDA: {
                            prompt: `Translate this in ${s}. Write ${o} AIDA writing framework for following product description ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        CopywritingFrameworkPAS: {
                            prompt: `Translate this in ${s}. Write ${o} PAS writing framework for following product description ${i}.`,
                            temperature: .8,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        WebsiteCopy: {
                            prompt: `Translate this in ${s}. Write ${o} website copy where website name ${a}, website about ${r}, and website product or brand description ${i}.`,
                            temperature: .8,
                            max_tokens: 350,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        Email: {
                            prompt: `Translate this in ${s}. Write ${o} email for following key points ${i}.`,
                            temperature: .7,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        EmailWritingSequence: {
                            prompt: `Translate this in ${s}. Write ${o} 10 Email sequences that I should send to my users/customers within one month for my following business ${i}.`,
                            temperature: .7,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GigDescription: {
                            prompt: `Translate this in ${s}. Write a ${o} gig description for following title ${a} and skills ${i}.`,
                            temperature: .8,
                            max_tokens: 350,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GrammarImprove: {
                            prompt: `Translate this in ${s}. Correct this to standard English:\n\n ${i}.`,
                            temperature: 0,
                            max_tokens: 60,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GrammarRephrase: {
                            prompt: `Translate this in ${s}. Rephrase this to standard English:\n\n ${i}.`,
                            temperature: 0,
                            max_tokens: 60,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GrammarExpand: {
                            prompt: `Translate this in ${s}. Write a detailed paragraph in ${o} tone for following topic:\n\n ${i} `,
                            temperature: 0,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GrammarShorten: {
                            prompt: `Translate this in ${s}. Summarize this text in standard English:\n\n ${i}.`,
                            temperature: 0,
                            max_tokens: 60,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        GrammarAppend: {
                            prompt: `Translate this in ${s}. Suggest two more lines for this text in standard English:\n\n ${i}.`,
                            temperature: 0,
                            max_tokens: 60,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        Interview: {
                            prompt: `Translate this in ${s}. Write ${o} list of interview questions where persons professional bio is ${i}. And interview context is ${p}.`,
                            temperature: .7,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        JobDescription: {
                            prompt: `Translate this in ${s}. Create ${o} job description for the following role ${a}.`,
                            temperature: .5,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        MagicCommand: {
                            prompt: `Translate this in ${s}. Use ${o} tone, ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        ChatGPT: {
                            prompt: `${i}`,
                            temperature: .8,
                            max_tokens: 600,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        PostandCaptionIdeas: {
                            prompt: `Translate this in ${s}. Write ${o} introduction text and title for the following post idea: ${a}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        productdescription: {
                            prompt: `Translate this in ${s}. Write ${o} product description for following details product name: ${a} about the product: ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        ProfileBio: {
                            prompt: `Translate this in ${s}. Write ${o} bio for ${i}.`,
                            temperature: .8,
                            max_tokens: 200,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        Poetry: {
                            prompt: `Translate this in ${s}. Write ${o} poetry for the following idea: ${i}.`,
                            temperature: 0,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        QuestionandAnswer: {
                            prompt: `Translate this in ${s}. I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the ${o} answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n\nQ: ${i}.`,
                            temperature: 0,
                            max_tokens: 300,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            stop: ["\n"],
                            engine: "text-davinci-003"
                        },
                        ReplytoReviewsandMessages: {
                            prompt: `Translate this in ${s}. Write ${o} reply for the following message: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        SEOMetaDescription: {
                            prompt: `Translate this in ${s}. Write 160 alphabet characters ${o} description for the following title: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        SEOMetaTitle: {
                            prompt: `Translate this in ${s}. Write 60 alphabet characters ${o} title for the following keywords: ${a}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        SMSandNotification: {
                            prompt: `Translate this in ${s}. Write ${o} short message as sms for the following context: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        SongLyrics: {
                            prompt: `Translate this in ${s}. Write ${o} song lyrics for the following song idea: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        StoryPlot: {
                            prompt: `Translate this in ${s}. Write ${o} story plot for the following story idea: ${i}.`,
                            temperature: .8,
                            max_tokens: 350,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        TaglineandHeadline: {
                            prompt: `Translate this in ${s}. Write ${o} tag line and head line for the following description: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        TestimonialandReview: {
                            prompt: `Translate this in ${s}. Create ${o} review or testimonial for the following product title: ${i} where focused keywords are: ${a}.`,
                            temperature: .8,
                            max_tokens: 150,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        VideoChannelDescription: {
                            prompt: `Translate this in ${s}. Write ${o} channel description for the following channel purpose: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        VideoDescription: {
                            prompt: `Translate this in ${s}. Write ${o} video description for the following video title: ${i}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        VideoIdea: {
                            prompt: `Translate this in ${s}. Write ${o} video idea for the following keywords: ${a}.`,
                            temperature: .8,
                            max_tokens: 100,
                            top_p: 1,
                            n: l,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-davinci-003"
                        },
                        Tab: {
                            prompt: c,
                            temperature: .9,
                            max_tokens: 25,
                            top_p: 1,
                            n: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            engine: "text-ada-001"
                        }
                    };
                let n = y[d].engine,
                    _ = {
                        prompt: y[d].prompt,
                        temperature: y[d].temperature,
                        max_tokens: y[d].max_tokens,
                        n: y[d].n,
                        top_p: y[d].top_p,
                        frequency_penalty: y[d].frequency_penalty,
                        presence_penalty: y[d].presence_penalty
                    };
                const u = new Configuration({
                    apiKey: "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"
                }),
                    g = new OpenAIApi(u);
                var m = "";
                g.createCompletion(n, _).then((n => {
                    var a;
                    n.data.choices.forEach((e => {
                        a = e.text, m += a + "<hr />"
                    }));
                    var r = wordCount(y[d].prompt + ' ' + m);
                    updateAIUsage(r, req);
                    var i = {
                        data: m,
                        words: r
                    };
                    res.status(200).send(i)
                })), checkusage = !1
            } else {
                res.status(404).send({
                    messege: "balance exhausted"
                })
            }
        }))
    })
];

function get_oauth_token(user_id) {
    const rows = `SELECT * FROM oauth_access_tokens WHERE user_id = '${user_id}' `;
    return rows;
}

function add_article(userId, projectId, title, language, wordLength, intent, articleHeading) {
    const rows = `INSERT INTO articals (user_id, project_id, title, language, words_length, intent, article_heading) VALUES ('${userId}',${projectId},'${title}','${language}','${wordLength}','${intent}','${articleHeading}')`;
    return rows;
}


async function checkAIUsage(e) {
    
    // console.log(e);

    try {
        const n = require("axios"),
            a = require("https"),
            r = {
                port: 443,
                url: "https://backend.writeme.ai/backend/api/aiUsage",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + e.body.back_auth
                },
                httpsAgent: new a.Agent({
                    rejectUnauthorized: !1
                })
            };

            console.log("here ");
        var t = (await n(r)).data.replace("artical", "");
        return JSON.parse(t).success.usage
    } catch (e) {
        t = e.response.data.replace("artical", "");
        if ("ErrorException" == JSON.parse(t).exception) return !1
    }
}

async function updateAIUsage(e, t) {
    try {
        const n = require("axios"),
            a = require("https"),
            r = {
                port: 443,
                url: "https://backend.writeme.ai/backend/api/updateUsage",
                data: {
                    articals: 1,
                    words: e
                },
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + t.body.back_auth
                },
                httpsAgent: new a.Agent({
                    rejectUnauthorized: !1
                })
            };
        await n(r)
    } catch {
        return "error"
    }
}


function wordCount(e) {
    return e.match(/(\w+)/g).length
}