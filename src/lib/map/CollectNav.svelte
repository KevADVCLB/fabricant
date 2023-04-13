<script>

    export let count = 0;

</script>
<div class="navigation">

    <div class="nav_signup">
        <div class="signup_date">0{count}/04</div>
        <p>Join the Tribe</p>
    </div>

</div>
<style lang="scss">

  @import "../../scss/theme";

  .navigation {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    lefT: 0;

    .nav_signup {
      position: absolute;
      width: 80px;
      height: 80px;
      right: 30px;
      top: 30px;

      @include for-tablet-landscape-up {
        width: 138px;
        height: 138px;
        right: 50px;
        top: 50px;
      }

      border-radius: 50%;
      background-color: #E8E8E8;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;

      .signup_date {
        font-style: normal;
        font-weight: bold;
        font-size: 10px;
        line-height: 18px;

        color: #aaaaaa;
        display: flex;
        flex-direction: column;
        width: fit-content;
        @include for-tablet-landscape-up {
          padding: 5px;
          font-size: 14px;
          line-height: 30px;
        }
        text-align: center;

        &:after {
          content: "";
          width: 100%;
          height: 2px;
          opacity: 0.5;
          background-color: #aaaaaa;
          bottom: 0;
          left: 0;
        }
      }

      p {
        font-style: normal;
        font-weight: normal;
        font-size: 8px;
        line-height: 12px;
        text-transform: uppercase;
        color: #aaaaaa;
        padding: 5px 0;
        @include for-tablet-landscape-up {
          padding: 5px;
          font-size: 13px;
          line-height: 15px;
        }
        text-align: center;
      }
    }
  }

</style>