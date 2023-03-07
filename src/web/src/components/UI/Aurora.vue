<template>
    <div class="full-width">
        <div class="aurora-town">
            <span class="aurora--main"></span>
        </div>
    </div>
</template>


<style scoped>
body .aurora--main:before {
    position: absolute;
    top: 0;
    right: -100px;
    display: block;
    overflow: hidden;
    width: 300px;
    height: 50px;
    content: "";
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease;
    background-image: url(../../../public/Aurora-small-mobile.svg);
    background-repeat: no-repeat
}

@media (min-width:767px) {
    body .aurora--main:before {
        position: absolute;
        top: -30px;
        right: -60%;
        width: 100%;
        height: 185px;
        -webkit-transition: all .4s ease;
        -o-transition: all .4s ease;
        transition: all .4s ease;
        background-image: url(../../../public/Aurora-main.svg);
        background-size: contain
    }
}

body .aurora--mini {
    display: inline-block;
    overflow: hidden;
    width: 100%;
    padding: 50px 0
}

body .aurora--mini:before {
    position: relative;
    display: block;
    width: 260px;
    height: 45px;
    margin: 0 auto;
    content: "";
    background-image: url(../../../public/Aurora-mini.svg);
    background-repeat: no-repeat
}

body .aurora-town {
    position: relative;
    width: 100vw;

    margin-top: -6px
}

body .aurora--main {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 50px;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease
}

@media (min-width:767px) {
    body .aurora--main {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 200px;
        -webkit-transition: all .4s ease;
        -o-transition: all .4s ease;
        transition: all .4s ease
    }
}

body .aurora--main:before {
    position: absolute;
    top: 0;
    right: -100px;
    display: block;
    overflow: hidden;
    width: 300px;
    height: 50px;
    content: "";
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease;
    background-image: url(../../../public/Aurora-small-mobile.svg);
    background-repeat: no-repeat
}

@media (min-width:767px) {
    body .aurora--main:before {
        position: absolute;
        top: -30px;
        right: -60%;
        width: 100%;
        height: 185px;
        -webkit-transition: all .4s ease;
        -o-transition: all .4s ease;
        transition: all .4s ease;
        background-image: url(../../../public/Aurora-main.svg);
        background-size: contain
    }
}

body .aurora--mini {
    display: inline-block;
    overflow: hidden;
    width: 100%;
    padding: 50px 0
}

body .aurora--mini:before {
    position: relative;
    display: block;
    width: 260px;
    height: 45px;
    margin: 0 auto;
    content: "";
    background-image: url(../../../public/Aurora-mini.svg);
    background-repeat: no-repeat
}
</style>