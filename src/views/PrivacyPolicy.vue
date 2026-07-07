<template>
  <div class="privacy-policy max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center gap-2 mb-6">
      <button class="flex h-9 w-9 items-center justify-center rounded-full text-blue-600 hover:bg-gray-100" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('nav.privacyPolicy') }}</h1>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <!-- 语言切换内容 -->
      <div v-if="locale === 'en'">
        <!-- English Version -->
        <section class="mb-8">
          <p class="text-gray-700 leading-relaxed mb-6">
            Welcome! This Privacy Policy governs the ttgame.fun website and it applies to all of TTGame' services and products. You should be aware that TTGame cannot be held responsible for the privacy policy of other sites and sources. By accessing ttgame.fun, you are consenting to this Privacy Policy.
          </p>
          <p class="text-gray-700 leading-relaxed mb-6">
            Whenever important changes are made to this policy, we will ask for your consent once again. TTGame respects the privacy of all users of its site and shall ensure the personal information you provide is treated confidentially.
          </p>
          <p class="text-gray-700 leading-relaxed">
            We are aware of the trust you place in us. We see it as our responsibility to protect your privacy. On this page, we will let you know what information we collect when you use our site, why we collect it, and how we improve your user experience. Thus, you will understand exactly how we work.
          </p>
        </section>

        <!-- Section A -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">A. Which data do we collect?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Our visitors' privacy is important to us and we recognize the need to provide additional privacy protection where is needed. Younger visitors should always check with their parents or guardians before entering information on any website and we encourage families to discuss their household guidelines regarding the online sharing of personal information.
          </p>
          
          <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Data we received from you</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            Only when you fill in the contact form provided on our website or subscribe for new games, we will process only two types of personal data: name and email.
          </p>

          <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Data we receive automatically</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            On your visit to our website, there is certain information that we collect from traffic references of the hosting server. We can collect some personal data through the use of cookies: see Cookie Consent. Some other (personal) data can be collected without the use of cookies. They can only be read and used during your visit to our site: IP address (used e.g. for preventing double voting), browser type and revision, (mobile) device type.
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            Related to traffic references of hosting servers. Every time you check out a website, there is certain information you make available for collection such as internet domain, IP address, time of visit, location, type of browser and operating system used to access our site, pages you visit, the address of that website and so on. Like others, we collect this information and use it for visitors statistics and to improve our services to you.
          </p>

          <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Data we receive from third parties</h3>
          <p class="text-gray-700 leading-relaxed">
            When we receive Personal Information from third parties we will inform you personally.
          </p>
        </section>

        <!-- Section B -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">B. Why do we collect these data? Based on which legal ground?</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Your personal data will be used to enable us to optimize the services we render and the content we provide. In certain cases when we are under a legal requirement to process personal data, like age limits, we will process these personal data. Secondly, we may use your personal data for direct marketing purposes, such as updates on new or existing games and newsletters. You will only receive electronic direct marketing communications from third parties if you have given us your explicit consent by ticking the box provided on our site.
          </p>
          <p class="text-gray-700 leading-relaxed">
            We may also use your personal data for statistical purposes and to improve our services and product (see Privacy Policy for Android/iOS apps). These processing activities are thus based on a justified legitimate interest in TTGame.
          </p>
        </section>

        <!-- Section C -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">C. Data retention periods</h2>
          <p class="text-gray-700 leading-relaxed">
            Your personal data will only be processed for as long as this is necessary for the purposes mentioned above. Unless there is a justified reason to retain the personal data, for example within the framework of customer relation management, your personal data will be deleted one month after you failed to visit our site for a consecutive period of two years.
          </p>
        </section>

        <!-- Section D -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">D. Your rights</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            You can get access to your personal data and rectify or erase them, free of charge. You also have the right to restrict the processing of your personal data. If you do not wish to receive newsletters or information about our products or services, you can at any moment and without any need for justification, object to the processing of your personal data for these purposes ("unsubscribe"). You can do this by sending us an e-mail. You can also do this by clicking on the unsubscribe link in our advertising e-mails. Moreover, you have the right to data portability for the personal data you have provided to TTGame.
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            To exercise these rights, we ask you to send a clear request, to the email address mentioned below, that states clearly what it is you want to know, rectify or erase. This request needs to be signed and dated and contain a copy of the front side of your identity card. You should specifically motivate your request if you want to rectify or erase personal data or restrict the processing thereof. Once these conditions are fulfilled, TTGame will execute your request as soon as possible and send you a message on this matter.
          </p>
        </section>

        <!-- Section E -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">E. Security measures</h2>
          <p class="text-gray-700 leading-relaxed">
            TTGame has taken all reasonable and appropriate technical and organizational measures to ensure the security of your personal data.
          </p>
        </section>

        <!-- Section F: Cookies and Tracking Technologies -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">F. Cookies and Tracking Technologies</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. They are sent to your browser from a website and stored on your device.
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            We use cookies for:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Essential website functionality</li>
            <li>Analytics and performance monitoring</li>
            <li>Advertising and personalization (including Google Adsense)</li>
            <li>User preference storage</li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
        </section>

        <!-- Section G: Third-Party Services -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">G. Third-Party Services</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We use third-party services for various purposes including:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Google Adsense:</strong> For serving advertisements on our website. Google uses cookies to serve ads based on your prior visits to our website or other websites.</li>
            <li><strong>Analytics Services:</strong> To understand how our website is used and to improve user experience</li>
            <li><strong>Game Content Providers:</strong> To deliver game content to our users</li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <!-- Section H: Children's Privacy -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">H. Children's Privacy</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Our website does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Child has provided us with Personal Information, please contact us.
          </p>
          <p class="text-gray-700 leading-relaxed">
            If we become aware that we have collected Personal Information from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p class="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at: 
          </p>
					<p>
						ttgame.contact@gmail.com
					</p>
					<p>
						(Alternate: 842334785@qq.com)
					</p>
        </section>
      </div>

      <!-- 中文版本 -->
      <div v-else>
        <!-- 中文内容 -->
        <section class="mb-8">
          <p class="text-gray-700 leading-relaxed mb-6">
            欢迎！本隐私政策适用于ttgame.fun网站以及TTGame的所有服务和产品。请注意，TTGame不对其他网站和来源的隐私政策负责。通过访问ttgame.fun，即表示您同意本隐私政策。
          </p>
          <p class="text-gray-700 leading-relaxed mb-6">
            每当对本政策进行重要更改时，我们将再次征求您的同意。TTGame尊重所有网站用户的隐私，并确保您提供的个人信息得到保密处理。
          </p>
          <p class="text-gray-700 leading-relaxed">
            我们深知您对我们的信任。我们将保护您的隐私视为我们的责任。在本页面中，我们将告知您在使用我们网站时我们收集哪些信息、为何收集这些信息以及如何改善您的用户体验。这样您就能确切了解我们的工作方式。
          </p>
        </section>

        <!-- Section A 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">A. 我们收集哪些数据？</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            我们非常重视访问者的隐私，并认识到在需要时提供额外隐私保护的必要性。年轻访问者在任何网站上输入信息前应始终与父母或监护人核实，我们鼓励家庭讨论有关在线共享个人信息的家庭准则。
          </p>
          
          <h3 class="text-lg font-semibold text-gray-800 mb-3">1. 我们从您那里收到的数据</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            只有当您填写我们网站上提供的联系表单或订阅新游戏时，我们才会处理两种类型的个人数据：姓名和电子邮件。
          </p>

          <h3 class="text-lg font-semibold text-gray-800 mb-3">2. 我们自动接收的数据</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            在您访问我们的网站时，我们会从托管服务器的流量参考中收集某些信息。我们可以通过使用cookies收集一些个人数据：请参阅Cookie同意。其他一些（个人）数据可以在不使用cookies的情况下收集。它们只能在您访问我们网站期间被读取和使用：IP地址（例如用于防止重复投票）、浏览器类型和版本、（移动）设备类型。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            与托管服务器的流量参考相关。每次您访问网站时，都会提供某些信息供收集，例如互联网域名、IP地址、访问时间、位置、用于访问我们网站的浏览器和操作系统类型、您访问的页面、该网站的地址等。与其他网站一样，我们收集这些信息并将其用于访问者统计和改进我们的服务。
          </p>

          <h3 class="text-lg font-semibold text-gray-800 mb-3">3. 我们从第三方收到的数据</h3>
          <p class="text-gray-700 leading-relaxed">
            当我们从第三方收到个人信息时，我们将亲自通知您。
          </p>
        </section>

        <!-- Section B 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">B. 我们为何收集这些数据？基于哪些法律依据？</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            您的个人数据将用于使我们能够优化我们提供的服务和内容。在某些情况下，当我们有法律要求处理个人数据时（例如年龄限制），我们将处理这些个人数据。其次，我们可能将您的个人数据用于直接营销目的，例如关于新游戏或现有游戏的更新和新闻通讯。只有在您通过勾选我们网站上提供的框明确同意的情况下，您才会收到来自第三方的电子直接营销通讯。
          </p>
          <p class="text-gray-700 leading-relaxed">
            我们还可以将您的个人数据用于统计目的和改进我们的服务和产品（请参阅Android/iOS应用的隐私政策）。因此，这些处理活动基于TTGame的合理合法利益。
          </p>
        </section>

        <!-- Section C 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">C. 数据保留期限</h2>
          <p class="text-gray-700 leading-relaxed">
            您的个人数据将仅在上述目的所需的时间内处理。除非有合理理由保留个人数据，例如在客户关系管理框架内，否则您的个人数据将在您连续两年未访问我们的网站后一个月被删除。
          </p>
        </section>

        <!-- Section D 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">D. 您的权利</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            您可以免费访问您的个人数据并进行更正或删除。您还有权限制对您个人数据的处理。如果您不希望收到有关我们产品或服务的新闻通讯或信息，您可以随时且无需任何理由反对为此目的处理您的个人数据（"取消订阅"）。您可以通过发送电子邮件给我们来做到这一点。您也可以通过点击我们广告电子邮件中的取消订阅链接来做到这一点。此外，您有权对您提供给TTGame的个人数据进行数据可移植性。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            要行使这些权利，我们要求您发送一个明确的请求到下面提到的电子邮件地址，清楚地说明您想要了解、更正或删除的内容。该请求需要签名、注明日期，并包含您身份证正面的副本。如果您想要更正或删除个人数据或限制其处理，应特别说明您的请求理由。一旦满足这些条件，TTGame将尽快执行您的请求并就此事项向您发送消息。
          </p>
        </section>

        <!-- Section E 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">E. 安全措施</h2>
          <p class="text-gray-700 leading-relaxed">
            TTGame已采取所有合理且适当的技术和组织措施来确保您的个人数据的安全。
          </p>
        </section>

        <!-- Section F: Cookies和跟踪技术 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">F. Cookies和跟踪技术</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            我们使用cookies和类似的跟踪技术来跟踪我们网站上的活动并存储某些信息。Cookies是包含少量数据的文件，可能包含匿名唯一标识符。它们从网站发送到您的浏览器并存储在您的设备上。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            我们使用cookies用于：
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>基本网站功能</li>
            <li>分析和性能监控</li>
            <li>广告和个性化（包括Google Adsense）</li>
            <li>用户偏好存储</li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            您可以指示浏览器拒绝所有cookies或在发送cookie时发出指示。但是，如果您不接受cookies，可能无法使用我们服务的某些部分。
          </p>
        </section>

        <!-- Section G: 第三方服务 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">G. 第三方服务</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            我们使用第三方服务用于各种目的，包括：
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Google Adsense:</strong> 用于在我们的网站上投放广告。Google使用cookies根据您之前访问我们网站或其他网站的情况来投放广告。</li>
            <li><strong>分析服务:</strong> 了解我们网站的使用情况并改善用户体验</li>
            <li><strong>游戏内容提供商:</strong> 向我们的用户提供游戏内容</li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            这些第三方仅有权访问您的个人信息以代表我们执行这些任务，并有义务不将其披露或用于任何其他目的。
          </p>
        </section>

        <!-- Section H: 儿童隐私 中文 -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">H. 儿童隐私</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            我们的网站不针对13岁以下的任何人（"儿童"）。我们不会故意收集13岁以下任何人的个人身份信息。如果您是父母或监护人，并且您知道您的孩子向我们提供了个人信息，请与我们联系。
          </p>
          <p class="text-gray-700 leading-relaxed">
            如果我们发现我们在未经验证父母同意的情况下收集了儿童的个人信息，我们会采取措施从我们的服务器中删除该信息。
          </p>
        </section>

        <!-- 联系方式 中文 -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">联系我们</h2>
          <p class="text-gray-700 leading-relaxed">
            如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
          </p>
					<p>
						ttgame.contact@gmail.com
					</p>
					<p>
						(备用: 842334785@qq.com)
					</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('preferred-language', locale.value)
}
</script>

<style scoped>
.privacy-policy {
  min-height: calc(100vh - 200px);
}

h1, h2, h3 {
  scroll-margin-top: 100px;
}

ul {
  list-style-type: disc;
}
</style>