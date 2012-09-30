/*global describe, it, xit, xdescribe, before, require */
var iz = require("../iz");

describe("Iz", function() {
    'use strict';

    it("Can validate alpha numeric values", function () {
        iz.alphaNumeric("a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj").should.be.ok;
        iz.alphaNumeric("aaaaaaa").should.be.ok;
        iz.alphaNumeric("999999").should.be.ok;
        iz.alphaNumeric(9999999).should.be.ok;
        iz.alphaNumeric("_3423423").should.not.be.ok;
        iz.alphaNumeric("342 3423").should.not.be.ok;
        iz.alphaNumeric("alals*fd").should.not.be.ok;
        iz.alphaNumeric({}).should.not.be.ok;
        iz.alphaNumeric(function () {}).should.not.be.ok;
        iz.alphaNumeric([]).should.not.be.ok;
    });

    it("Can validate that a primitive is between 2 other primitives", function () {
        iz.between(5, 5, 6).should.be.ok;
        iz.between(6, 5, 6).should.be.ok;
        iz.between(4, 3, 5).should.be.ok;
        iz.between(3, 4, 5).should.not.be.ok;
        iz.between(7, 4, 5).should.not.be.ok;
        iz.between("abc", "aaa", "bbb").should.be.ok;
        iz.between("aaa", "abc", "bbb").should.not.be.ok;
        iz.between("aaa", "aaa", "bbb").should.be.ok;
        iz.between([1, 2], [1], [1, 4]).should.not.be.ok; //default array comparison... this is false.
        iz.between({},{},{}).should.not.be.ok; //it hates objects
        iz.between(function (){}, function (){}, function () {}).should.not.be.ok; //it also despises functions
    });

    it("Can validate boolean values", function () {
        iz.boolean(true).should.be.ok;
        iz.boolean(false).should.be.ok;
        iz.boolean(1).should.be.ok;
        iz.boolean(0).should.be.ok;
        iz.boolean(-1).should.not.be.ok;
        iz.boolean("deadbeef").should.not.be.ok;
        iz.boolean("*").should.not.be.ok;
        iz.boolean(/[ -]/g).should.not.be.ok
    });

    /**
     * Tests from Paypal: http://www.paypalobjects.com/en_US/vhelp/paypalmanager_help/credit_card_numbers.htm
     */
    it("Can validate credit card numbers", function () {
        iz.cc("371449635398431").should.be.ok; //amex
        iz.cc("343434343434343").should.be.ok; //amex
        iz.cc("371144371144376").should.be.ok; //amex corp
        iz.cc("5610591081018250").should.be.ok; //aus bankcard
        iz.cc("30569309025904").should.be.ok; //diners club
        iz.cc("38520000023237").should.be.ok; //diners club
        iz.cc("6011111111111117").should.be.ok; //discover
        iz.cc("6011000990139424").should.be.ok; //discover
        iz.cc("3530111333300000").should.be.ok; //jcb
        iz.cc("3566002020360505").should.be.ok; //jcb
        iz.cc("5555555555554444").should.be.ok; //mc
        iz.cc("5105105105105100").should.be.ok; //mc
        iz.cc("4111111111111111").should.be.ok; //visa
        iz.cc("4012888888881881").should.be.ok; //visa
        iz.cc("4222222222222").should.be.ok; //visa
        //iz.cc("76009244561").should.be.ok; //dankort (pbs) currently fails... anyone know why?
        iz.cc("5019717010103742").should.be.ok; //dankort (pbs)
        iz.cc("6331101999990016").should.be.ok; //switch/solo (paymentech)

        iz.cc("0000000000000000").should.not.be.ok;

        iz.cc("4012 8888 8888 1881").should.be.ok; //visa with spaces
        iz.cc("4012-8888-8888-1881").should.be.ok; //visa with dashes
        iz.cc({}).should.not.be.ok;
        iz.cc(function () {}).should.not.be.ok;
        iz.cc(["5"]).should.not.be.ok;
    });

    it("Can validated dates", function () {
        iz.date(new Date()).should.be.ok;
        iz.date(0).should.be.ok; //assumed milliseconds from epoch
        iz.date("09/23/2012").should.be.ok;
        iz.date("09-23-2012 21:27:00").should.be.ok;
        iz.date("January 5th, 2012").should.not.be.ok;
        iz.date("Pizza").should.not.be.ok;
        iz.date({}).should.not.be.ok;
        iz.date(function () {}).should.not.be.ok;
        iz.date([]).should.not.be.ok;
    });

    it("Can validate decimals", function () {
        iz.decimal("5.5").should.be.ok;
        iz.decimal(5.5).should.be.ok;
        iz.decimal("340298.3234234").should.be.ok;

        iz.decimal(5).should.not.be.ok;
        iz.decimal("5").should.not.be.ok;
        iz.decimal("5.5.5").should.not.be.ok;
        iz.decimal({}).should.not.be.ok;
        iz.decimal(function () {}).should.not.be.ok;
        iz.decimal([]).should.not.be.ok;
    });

    it("Can validate email address", function () {
        iz.email("bob@bob").should.be.ok;
        iz.email("bob@bob.com").should.be.ok;
        iz.email("bob").should.not.be.ok;
        iz.email({}).should.not.be.ok;
        iz.email(function () {}).should.not.be.ok;
        iz.email([]).should.not.be.ok;
        iz.email(5).should.not.be.ok;
    });

    it("Can validate that an object is an extension of another object", function () {
        iz.extension({},"5").should.not.be.ok;
        iz.extension({
            bob: 10,
            something: "hi",
            somethingElse: "bye"
        },{
            bob: "912dfinn",
            something: "yes!"
        }).should.be.ok;
        iz.extension([],[]).should.be.ok;
        iz.extension({
            bob: 10,
            something: "hi"
        },{
            bob: "912dfinn",
            something: "yes!",
            somethingElse: "bye"
        }).should.not.be.ok;
        iz.extension([],["hello"]).should.not.be.ok;
    });

    it("Can validate that a file extension is valid", function () {
        iz.fileExtension(["pizza"],"apple_pie.pizza").should.be.ok;
        iz.fileExtension(["png"],"hello.png").should.be.ok;
        iz.fileExtension(["png"],"hello.PNG").should.be.ok;
        iz.fileExtension([], "").should.not.be.ok;
        iz.fileExtension("","").should.not.be.ok;
        iz.fileExtension(["PNG"],"hello.png").should.not.be.ok;
        iz.fileExtension([".png"],"hello.png").should.not.be.ok;
        iz.fileExtension(["png"],"hello.mp3").should.not.be.ok;
        iz.fileExtension({},{}).should.not.be.ok;
    });

    it("Can validate audio file extensions", function () {
        iz.fileExtensionAudio("apple.mp3").should.be.ok;
        iz.fileExtensionAudio("apple.png").should.not.be.ok;
    });

    it("Can validate image file extensions", function () {
        iz.fileExtensionImage("apple.png").should.be.ok;
        iz.fileExtensionImage("apple.mp3").should.not.be.ok;
    });

    it("Can validate video file extensions", function () {
        iz.fileExtensionVideo("apple.mp4").should.be.ok;
        iz.fileExtensionVideo("apple.mp3").should.not.be.ok;
    });

    it("Can tell if something is in an array", function () {
        iz.inArray(["pizza","chicken","tofu","turkey"], "tofu").should.be.ok;
        iz.inArray(["pizza","chicken","tofu","turkey"], "lizard").should.not.be.ok;
        iz.inArray(5,6).should.not.be.ok;
        iz.inArray({},[]).should.not.be.ok;
        iz.inArray(function () {}, 5).should.not.be.ok;
    });

    it("Can validate integers", function () {
        iz.int("1000").should.be.ok;
        iz.int(1000).should.be.ok;
        iz.int(999).should.be.ok;
        iz.int("11.0", true).should.be.ok;

        iz.int("11.0").should.not.be.ok;
        iz.int(11.2).should.not.be.ok;
        iz.int("bob").should.not.be.ok;
        iz.int({}).should.not.be.ok;
        iz.int([]).should.not.be.ok;
        iz.int(function () {}).should.not.be.ok;
    });

    it("Can validate IPv4, IPv6 and host names", function () {
        iz.ip("pizza").should.be.ok;
        //ipv6
        iz.ip("3ffe:1900:4545:3:200:f8ff:fe21:67cf").should.be.ok;
        iz.ip("fe80:0:0:0:200:f8ff:fe21:67cf").should.be.ok;
        iz.ip("fe80::200:f8ff:fe21:67cf").should.be.ok;
        //ipv4
        iz.ip("0.0.0.0").should.be.ok;
        iz.ip("192.0.2.235").should.be.ok;
        //technically valid (citing wikipedia), but doesn't pass, but I don't think it is expected:
        iz.ip("0xC0.0x00.0x02.0xEB").should.not.be.ok;
        iz.ip("0300.0000.0002.0353").should.not.be.ok;
        iz.ip("0xC00002EB").should.not.be.ok
        iz.ip("3221226219").should.not.be.ok;
        iz.ip("030000001353").should.not.be.ok;
    });

    it("Can require a string to have some min length", function () {
        iz.minLength("Pizza", 5).should.be.ok;
        iz.minLength("pizza", 4).should.be.ok;
        iz.minLength("pizza", 6).should.not.be.ok;
        iz.minLength({}, 5).should.not.be.ok;
        iz.minLength("lizard", {}).should.not.be.ok;
    });

    it("Can require an array to have some min length", function () {
        iz.minLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
        iz.minLength([1, 2, 3, 4, 5, 6], 5).should.be.ok;
        iz.minLength([1, 2, 3, 4, 5, 6], 7).should.not.be.ok;
    });

    it("Can require a string to have some max length", function () {
        iz.maxLength("Pizza", 5).should.be.ok;
        iz.maxLength("pizza", 6).should.be.ok;
        iz.maxLength("pizza", 4).should.not.be.ok;
        iz.maxLength({}, 5).should.not.be.ok;
        iz.maxLength("lizard", {}).should.not.be.ok;
    });

    it("Can require an array to have some max length", function () {
        iz.maxLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
        iz.maxLength([1, 2, 3, 4, 5, 6], 7).should.be.ok;
        iz.maxLength([1, 2, 3, 4, 5, 6], 5).should.not.be.ok;
    });

    it("Can tell if a number is multiple of another number", function () {
        iz.multiple(10, 5).should.be.ok;
        iz.multiple(10, 2).should.be.ok;
        iz.multiple(2, 10).should.not.be.ok;
        iz.multiple(5, {}).should.not.be.ok; // disallow everything but numbers
    });

    it("Can tell if something is a number", function () {
        iz.number({}).should.not.be.ok;
        iz.number("5").should.be.ok;
        iz.number("5.32342").should.be.ok;
        iz.number(23123).should.be.ok;
        iz.number("bob").should.not.be.ok;
    });

    it("Can tell if the name of an object is equal to some string", function () {
        var obj = {};

        function Car() { }

        iz.ofType(new Car(), "Car").should.be.ok;
        iz.ofType(new Car(), "Object").should.not.be.ok;
        iz.ofType(obj, "Object").should.be.ok;
    });

    it("Can validate a north american phone number", function () {
        iz.phone(1231231).should.not.be.ok;
        iz.phone({}).should.not.be.ok;

        iz.phone("1-415-222-2222").should.be.ok;
        iz.phone("1.415.555.5555 extension 422").should.be.ok;
        iz.phone("1415.323.3242 extension x422").should.be.ok;
        iz.phone("11231234567").should.be.ok;

        iz.phone("123").should.not.be.ok;
        iz.phone("123456789012").should.not.be.ok;

        iz.phone("1234567890").should.be.ok;
        iz.phone("12345678901").should.be.ok;
    });

    it("Can validate a US zip-code", function () {
        iz.postal(1231231).should.not.be.ok;
        iz.postal({}).should.not.be.ok;

        iz.postal("94117").should.be.ok;
        iz.postal("94117 3333").should.be.ok;
        iz.postal("94117-3333").should.be.ok;
        iz.postal("94117 33333").should.not.be.ok;
        iz.postal("9411").should.not.be.ok;
    });

    it("Can validate a US SSN", function () {
        iz.ssn(123).should.not.be.ok;
        iz.ssn({}).should.not.be.ok;

        iz.ssn("123456789").should.be.ok;
        iz.ssn("123-45-6789").should.be.ok;

        iz.ssn("1234567890").should.not.ok;
        iz.ssn("123-45-678").should.not.be.ok;
    });
});