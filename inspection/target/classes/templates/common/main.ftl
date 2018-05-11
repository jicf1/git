<div class="content-wrapper" style="overflow: hidden;background-color: #FFFFFF;">
	<iframe id="view_iframe" name="view_iframe" src="${ctx.contextPath}/welcome" class="content-iframe" height="0" style="border: 0; width: 100%;margin-top:20px;"></iframe>
</div>
<script>
	$(".content-wrapper").height($(window).height() - $(".main-header").height() + "px !important");
</script>
<script>
	$(window).load(function() {
		resize();
	});
	$(window).resize(function() {
		resize();
	});
	function resize() {
		$(".content-wrapper").height($(window).height() - $(".main-header").get(0).offsetHeight + "px");
		$("iframe.content-iframe").height($(".content-wrapper").height() + "px");
		$(".sidebar-toggle").height($(".logo").height() - 30 + "px");
	}
</script>
