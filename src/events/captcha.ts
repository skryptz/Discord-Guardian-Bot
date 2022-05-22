import { Event } from "../structures/Event";
import { Captcha } from "captcha-canvas";
import { MessageAttachment, MessageEmbed } from "discord.js";

export default new Event("guildMemberAdd", async (member) => {
    console.log(`${member.user.tag} has joined`);
    const captcha = new Captcha();
    captcha.async = true;
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();

    const captchaAttachment = new MessageAttachment(
        await captcha.png,
        "captcha.png"
    );

    const captchaEmbed = new MessageEmbed()
        .setDescription('What does it say?')
        .setImage('attachment://captcha.png');

    const msg = await member.send({ 
        files: [captchaAttachment],
        embeds: [captchaEmbed],
    });

    const filter = (message) => {
        if(message.author.id !== member.id) return;
        if(message.content === captcha.text) return true;
        else member.send("wrong captcha");
    };

    try{
    const response = await msg.channel.awaitMessages({
        filter, max: 1, time: 30000, errors: ["time"]
    });

    if(response) {
        member.roles.add('949447628687548417');
        member.send(`Okay ${member.displayName}, ur smart`)
    }} catch(err) {
        await member.send(`Bye Bye`)
        member.kick(`RIP Captcha`)
    }
});